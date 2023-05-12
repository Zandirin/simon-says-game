/**
 * @jest-environment jsdom
 */
const { game, newGame, addTurn, lightsOn, showTurns, playerTurn } = require("../game");

jest.spyOn(window, "alert").mockImplementation(() => { });

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
})

describe("game object contains correct keys", () => {
    test("score key exists", () => {
        expect("score" in game).toBe(true);
    })
    test("currentGame key exists", () => {
        expect("currentGame" in game).toBe(true);
    });
    test("playerMoves key exists", () => {
        expect("playerMoves" in game).toBe(true);
    });
    test("choices key exists", () => {
        expect("choices" in game).toBe(true);
    });
    test("choices contain the correct ids", () => {
        expect(game.choices).toEqual(["button1", "button2", "button3", "button4"]);
    });
    test("turnNumber key exists", () => {
        expect("turnNumber" in game).toBe(true);
    });
    test("turnNumber key exists", () => {
        expect("turnInProgress" in game).toBe(true);
    });
    test("turnInProgress default value is false", () => {
        expect(game.turnInProgress).toEqual(false);
    });
    test("turnNumber key exists", () => {
        expect("lastButton" in game).toBe(true);
    });
})

describe("newGame works correctly", () => {
    beforeAll(() => {
        game.score = 42;
        game.playerMoves = ["button1", "button2"];
        game.currentGame = ["button1", "button2"];
        document.getElementById("score").innerText = "42";
        newGame();
    })
    test("game.score should be equal to zero", () => {
        expect(game.score).toEqual(0);
    })
    test("playerMoves array should empty", () => {
        expect(game.playerMoves.length).toEqual(0);
    })
    test("should be an element in currentGame array", () => {
        expect(game.currentGame.length).toEqual(1);
    });
    test("should display 0 in score element", () => {
        expect(document.getElementById("score").innerText).toEqual(0);
    });
    test("data-listener is set to true", () => {
        const elements = document.getElementsByClassName("circle");
        for(let element of elements) {
            expect(element.getAttribute("data-listener")).toEqual("true");
        }
    })
})

describe("gameplay works correctly", () => {
    beforeEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn();
    });
    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });
    test("addTurn adds a new turn to the game", () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });
    test("should add light class to a button", () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain("light");
    });
    test("showTurns should update the games turn number", () => {
        game.turnNumer = 42;
        showTurns();
        expect(game.turnNumber).toBe(0);
    });
    test("Score should increase if player move matches computer move", () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    });
    test("should show an alert if wrong move is made", () => {
        game.playerMoves.push("wrong");
        playerTurn();
        expect(window.alert).toBeCalledWith("Wrong move!");
    });
    test("should make turnInProgress equal to true", () => {
        showTurns();
        expect(game.turnInProgress).toBe(true);
    });
    test("click during computer turn should fail", () => {
        showTurns();
        game.lastButton = "";
        document.getElementById("button2").click();
        expect(game.lastButton).toEqual("");
    });
})