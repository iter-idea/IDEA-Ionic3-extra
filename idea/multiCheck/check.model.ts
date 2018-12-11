export class IDEACheck {
  /**
   * The unique identifier for the check element.
   */
  public value: string | number;
  /**
   * Displayed name (description) of the check element.
   */
  public name: string;
  /**
   * Whether the check is true or false.
   */
  public checked: boolean;
  /**
   * Elements not included in the current search because of other filters.
   */
  public hidden: boolean;

  constructor(x?: any) {
    x = x || <IDEACheck> {};
    this.value = x.value;
    this.name = x.name ? String(x.name) : String(this.value);
    this.checked = Boolean(x.checked);
    this.hidden = Boolean(x.hidden);
  }
}
