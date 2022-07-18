{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    utils = {
      url = "github:numtide/flake-utils";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages.hwaet = pkgs.stdenv.mkDerivation {
          name = "hwaet";
          src = ./.;

          buildInputs = with pkgs.elmPackages; [ elm ];

          configurePhase = pkgs.elmPackages.fetchElmDeps {
            elmVersion = "0.19.1";
            elmPackages = import ./nix/elm-srcs.nix;
            registryDat = ./nix/registry.dat;
          };

          buildPhase = ''
            elm make src/Main.elm --output=public/main.js --optimize
          '';

          installPhase = ''
            mkdir -p $out
            cp -rf public/* $out
          '';
        };

        packages.default = self.packages.${system}.hwaet;

        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            elmPackages.elm
            elmPackages.elm-format
            elm2nix
          ];
        };
      }
    );
}
