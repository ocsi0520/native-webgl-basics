import { allAxis, Axis } from "./axis";

export class RotationComponent {
  private currentState: Record<
    Axis,
    { currentDegree: number; increment: number }
  > = {
    x: { currentDegree: 0, increment: 1 },
    y: { currentDegree: 0, increment: 1 },
    z: { currentDegree: 0, increment: 1 },
  };

  public attach(container: HTMLElement): void {
    const wrapperDiv = document.createElement("div");
    wrapperDiv.className = "checkbox-wrapper";
    wrapperDiv.innerHTML = `<label>X-axis<input type="checkbox" checked /></label>
      <label>Y-axis<input type="checkbox" checked /></label>
      <label>Z-axis<input type="checkbox" checked /></label>`;

    const allInput = wrapperDiv.querySelectorAll("input");
    allAxis.forEach((axis, index) => {
      allInput[index].onchange = () => this.toggleAxis(axis);
    });

    container.appendChild(wrapperDiv);
  }

  public increment(): void {
    for (const axis of allAxis)
      this.currentState[axis].currentDegree +=
        this.currentState[axis].increment;
  }

  public getRotationFor(axis: Axis): number {
    return this.currentState[axis].currentDegree;
  }

  private toggleAxis(axis: Axis): void {
    this.currentState[axis].increment = 1 - this.currentState[axis].increment;
  }
}
