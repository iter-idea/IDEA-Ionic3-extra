export interface IDEAAutoCompleteService {
  labelAttribute?: string;  // the literal name of the title attribute
  formValueAttribute?: any; // the value of the field when used in a formGroup. 

  /**
   * This method should return an array of objects (results).
   * @param term
   */
  getResults(term: any): any;
  
  /**
   * This method parses each item of the results from data service.
   * The returned value is the displayed form of the result.
   * @param item
   */
  getItemLabel?(item: any): any;
}