export default class Reminder {
  isCompleted: boolean;

  constructor(public readonly id: number, public title: string) {
    this.isCompleted = false;
  }
}
