module Main exposing (main)

import Beowulf exposing (beowulf)
import Browser exposing (element)
import Html exposing (Html, a, div, h1, input, p, text)
import Html.Attributes as Attrs exposing (class, href, id, type_, value)
import Html.Events exposing (onInput)
import Random exposing (generate)
import Random.Extra exposing (sequence)
import Random.List exposing (choices)


main : Program () Model Msg
main =
    element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }


type alias Model =
    { text : List String, sentences : Int, paragraphs : Int }


type Msg
    = Gen
    | Update UpdateType String
    | NewText (List ( List String, List String ))


type UpdateType
    = Sentences
    | Paragraphs


init : () -> ( Model, Cmd Msg )
init _ =
    update Gen (Model [] 3 2)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Gen ->
            let
                genParagraphs =
                    choices model.sentences beowulf
                        |> List.repeat model.paragraphs
                        |> sequence
            in
            ( model, generate NewText genParagraphs )

        Update t v ->
            let
                val =
                    Maybe.withDefault 0 <| String.toInt v

                newModel =
                    case t of
                        Sentences ->
                            { model | sentences = val }

                        Paragraphs ->
                            { model | paragraphs = val }
            in
            update Gen newModel

        NewText r ->
            let
                hwaet paragraphs =
                    case paragraphs of
                        [] ->
                            []

                        h :: t ->
                            ("Hwæt! " ++ h) :: t

                flattenedPargraphs =
                    List.map Tuple.first r
                        |> List.map (String.join " ")
            in
            ( { model | text = hwaet <| flattenedPargraphs }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


view : Model -> Html Msg
view model =
    let
        header : Html Msg
        header =
            h1 [] [ text "Hwæt :: Old English Lorem Ipsum" ]

        controlsView : Html Msg
        controlsView =
            div [ id "controls" ]
                [ div [ class "control" ]
                    [ input
                        [ type_ "range"
                        , Attrs.min "1"
                        , Attrs.max "5"
                        , value <| String.fromInt model.paragraphs
                        , onInput <| Update Paragraphs
                        ]
                        []
                    , text <| "Paragraphs :: " ++ String.fromInt model.paragraphs
                    ]
                , div [ class "control" ]
                    [ input
                        [ type_ "range"
                        , Attrs.min "1"
                        , Attrs.max "10"
                        , value <| String.fromInt model.sentences
                        , onInput <| Update Sentences
                        ]
                        []
                    , text <| "Sentences :: " ++ String.fromInt model.sentences
                    ]
                ]

        textView : Html Msg
        textView =
            div [ id "text" ] (List.map (\y -> p [] [ text y ]) model.text)

        footer : Html Msg
        footer =
            div [ id "footer" ] [ a [ href "https://github.com/autophagy/hwaet" ] [ text "src" ] ]
    in
    div [ id "hwaet" ]
        [ header
        , controlsView
        , textView
        , footer
        ]
