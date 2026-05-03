import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import LanguageToggle from "./LanguageToggle";

test("renders english and thai options and calls onChange with the selected value", () => {
  const onChange = jest.fn();

  render(<LanguageToggle currentLanguage="en" onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: "TH" }));
  expect(onChange).toHaveBeenCalledWith("th");
});
