import { render, screen } from "@testing-library/react";
import App from "./App";

test("megjelenik a cim", () => {
  render(<App />);
  const cimElem = screen.getByText(/112 Segélyhívó Szimuláció/i);
  expect(cimElem).toBeInTheDocument();
});