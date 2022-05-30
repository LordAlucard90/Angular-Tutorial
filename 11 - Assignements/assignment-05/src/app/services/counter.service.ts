export class CounterService {
  public activations: number = 0;
  public deactivations: number = 0;

  incrementActivations(){
    this.activations++;
  }

  incrementDeactivations(){
    this.deactivations++;
  }
}
