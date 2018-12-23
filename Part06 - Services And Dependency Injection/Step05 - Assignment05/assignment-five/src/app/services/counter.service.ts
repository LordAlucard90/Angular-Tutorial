export class CounterService {
  activations: number = 0;
  deactivations: number = 0;

  incrementActivations(){
    this.activations++;
  }

  incrementDeactivations(){
    this.deactivations++;
  }
}
