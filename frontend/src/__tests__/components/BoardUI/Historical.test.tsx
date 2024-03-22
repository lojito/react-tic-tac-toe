import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import Historical from "../../../components/BoardUI/Historical";
import { Player, SquareBoard, SquareLocation } from "../../../types";

jest.mock(
  "../../../components/Square/Historical",
  () =>
    ({ disabled, id, imagePath, className }: SquareBoard) => {
      const url =
        imagePath === "default"
          ? undefined
          : `url(${process.env.PUBLIC_URL}/images/${imagePath}.jpg)`;
      return (
        <button
          className={className}
          disabled={false}
          id={id}
          style={{ backgroundImage: url }}
        />
      );
    }
);

describe("Historical", () => {
  it("should render correctly", () => {
    const { asFragment } = render(
      <Historical
        board={[
          Player.Nobody,
          Player.Nobody,
          Player.Computer,
          Player.User,
          Player.Nobody,
          Player.Nobody,
          Player.Nobody,
          Player.Nobody,
          Player.Nobody,
        ]}
        folder="soccer"
        userImage={0}
        computerImage={1}
        winners={[]}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("should render with 3 winning squares", () => {
    render(
      <Historical
        board={[
          Player.Computer,
          Player.Computer,
          Player.Computer,
          Player.User,
          Player.User,
          Player.User,
          Player.Nobody,
          Player.Nobody,
          Player.Nobody,
        ]}
        folder="soccer"
        userImage={0}
        computerImage={1}
        winners={[
          SquareLocation.TopLeft,
          SquareLocation.TopCenter,
          SquareLocation.TopRight,
        ]}
      />
    );

    const squares = screen.getAllByRole("button");

    expect(squares).toHaveLength(9);
    expect(squares[SquareLocation.TopLeft]).toHaveClass("win");
    expect(squares[SquareLocation.TopCenter]).toHaveClass("win");
    expect(squares[SquareLocation.TopRight]).toHaveClass("win");
  });
});
