import { Component, OnInit } from '@angular/core';
import { Machine, interpret, StateValue } from 'xstate';

@Component({
  selector: 'app-traffic-lights',
  templateUrl: './traffic-lights.component.html',
  styleUrls: ['./traffic-lights.component.css']
})
export class TrafficLightsComponent implements OnInit {

  public stop: boolean;
  public go: boolean;
  public wait: boolean;
  constructor() { }

  ngOnInit() {
    promiseService.start();

    setInterval(() => {
      promiseService.send('TIMEOUT');
  }, 5000);

    promiseService.onTransition(state => {
      console.log(state.value);
      this.stop = state.matches('stop');
      this.go = state.matches('go');
      this.wait = state.matches('wait');
    }
  );

  }

}

const trafficLightMachine = Machine({
  id: 'trafficLight',
  initial: 'go',
  states: {
    go: {
      on: {
        TIMEOUT: 'wait'
      }
    },
    wait: {
      on: {
        TIMEOUT: 'stop'
      }
    },
    stop: {
      on: {
        TIMEOUT: 'go'
      }
    }
  }
});

const promiseService = interpret(trafficLightMachine);
