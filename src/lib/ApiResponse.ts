export default class ApiResponse {
  success;
  message;
  data;
  constructor(success: boolean, message: string, data?: any) {
    this.success = success;
    this.message = message;
    if (data) {
      this.data = data;
    }
  }
}
