module Main exposing (..)

import Beowulf exposing (beowulf)
import Browser
import Html exposing (..)
import Html.Attributes
import Html.Events exposing (..)
import Random
import Random.Extra
import Random.List

main : Program () Model Msg
main =
    Browser.element
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
                    Random.List.choices model.sentences beowulf
                        |> List.repeat model.paragraphs
                        |> Random.Extra.sequence
            in
            ( model, Random.generate NewText genParagraphs )

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
        controlsView : Html Msg
        controlsView =
            div [ Html.Attributes.id "controls" ]
                [ div [ Html.Attributes.class "control" ]
                    [ input
                        [ Html.Attributes.type_ "range"
                        , Html.Attributes.min "1"
                        , Html.Attributes.max "5"
                        , Html.Attributes.value <| String.fromInt model.paragraphs
                        , onInput <| Update Paragraphs
                        ]
                        []
                    , text <| "Paragraphs :: " ++ String.fromInt model.paragraphs
                    ]
                , div [ Html.Attributes.class "control" ]
                    [ input
                        [ Html.Attributes.type_ "range"
                        , Html.Attributes.min "1"
                        , Html.Attributes.max "10"
                        , Html.Attributes.value <| String.fromInt model.sentences
                        , onInput <| Update Sentences
                        ]
                        []
                    , text <| "Sentences :: " ++ String.fromInt model.sentences
                    ]
                ]

        textView : Html Msg
        textView =
            div [ Html.Attributes.id "text" ] (List.map (\y -> p [] [ text y ]) model.text)
    in
    div [ Html.Attributes.id "hwaet" ]
        [ h1 [] [ text "Hwæt :: Old English Lorem Ipsum" ]
        , controlsView
        , textView
        ]
