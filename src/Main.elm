module Main exposing (..)

import Beowulf exposing (beowulf)
import Browser
import Html exposing (..)
import Html.Attributes
import Html.Events exposing (..)
import Random
import Random.Extra
import Random.List


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
    | UpdateSentences String
    | UpdateParagraphs String
    | NewText (List ( List String, List String ))


init : () -> ( Model, Cmd Msg )
init _ =
    update Gen (Model [] 4 1)


genParagraph : Int -> Random.Generator ( List String, List String )
genParagraph sentences =
    Random.List.choices sentences beowulf


genParagraphs : Int -> Int -> Random.Generator (List ( List String, List String ))
genParagraphs paragraphs sentences =
    Random.Extra.sequence (List.repeat paragraphs (Random.List.choices sentences beowulf))


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Gen ->
            ( model, Random.generate NewText (genParagraphs model.paragraphs model.sentences) )

        UpdateParagraphs v ->
            update Gen { model | paragraphs = String.toInt v |> Maybe.withDefault 0 }

        UpdateSentences v ->
            update Gen { model | sentences = String.toInt v |> Maybe.withDefault 0 }

        NewText r ->
            ( { model | text = List.map (\( a, _ ) -> String.join " " a) r }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


view : Model -> Html Msg
view model =
    div []
        (List.append
            [ input
                [ Html.Attributes.type_ "range"
                , Html.Attributes.min "1"
                , Html.Attributes.max "5"
                , Html.Attributes.value <| String.fromInt model.paragraphs
                , onInput UpdateParagraphs
                ]
                []
            , input
                [ Html.Attributes.type_ "range"
                , Html.Attributes.min "1"
                , Html.Attributes.max "10"
                , Html.Attributes.value <| String.fromInt model.sentences
                , onInput UpdateSentences
                ]
                []
            ]
            (List.map (\y -> p [] [ text y ]) model.text)
        )
