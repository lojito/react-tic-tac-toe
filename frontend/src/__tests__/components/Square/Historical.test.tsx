import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import SquareHistorical from "../../../components/Square/Historical";

describe("SquareHistorical", () => {
  const renderSquare = (imagePath = "default") => {
    const utils = render(
      <SquareHistorical
        disabled
        id="100"
        imagePath={imagePath}
        className="win"
      />
    );
    const squareButton = screen.getByRole("button", { name: "historical" });

    return { ...utils, squareButton };
  };

  it("should render correctly", () => {
    const { asFragment } = renderSquare();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should apply the props", () => {
    const imagePath = "soccer/6";

    const { squareButton } = renderSquare(imagePath);

    expect(squareButton).toBeDisabled();
    expect(squareButton).toHaveAttribute("id", "100");
    expect(squareButton).toHaveAttribute("class", "win");
    expect(squareButton).toHaveStyle({ backgroundImage: /soccer\/6/ });
  });
});
