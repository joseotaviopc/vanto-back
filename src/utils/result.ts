export class Result<T> {
    public isSuccess: boolean;
    public isFailure: boolean
    public error: string | null;
    private result: T | null;
  
    private constructor (isSuccess: boolean, error: string, result: T | null) {
      if (isSuccess && error) {
        throw new Error(`InvalidOperation: A result cannot be 
          successful and contain an error`);
      }
      if (!isSuccess && !error) {
        throw new Error(`InvalidOperation: A failing result 
          needs to contain an error message`);
      }
  
      this.isSuccess = isSuccess;
      this.isFailure = !isSuccess;
      this.error = error;
      this.result = result;
      
      Object.freeze(this);
    }
  
    public getValue () : T {
      if (!this.isSuccess || !this.result) {
        throw new Error(`Cant retrieve the value from a failed result.`)
      } 
  
      return this.result;
    }
  
    public static ok<U> (result: U) : Result<U> {
      return new Result<U>(true, "", result);
    }
  
    public static fail<U> (error: string): Result<U> {
      return new Result<U>(false, error, null);
    }
  
    public static combine (results: Result<any>[]) : Result<any> {
      for (let result of results) {
        if (result.isFailure) return result;
      }
      return Result.ok<any>(results);
    }
  }