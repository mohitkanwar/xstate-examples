import { Component, OnInit } from '@angular/core';
import { Machine, interpret } from 'xstate';

@Component({
  selector: 'app-traffic-lights',
  templateUrl: './traffic-lights.component.html',
  styleUrls: ['./traffic-lights.component.css']
})
export class TrafficLightsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    promiseService.start();

    setInterval(() => {
      promiseService.send('TIMEOUT');
  }, 5000);
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

const promiseService = interpret(trafficLightMachine).onTransition(state =>
  console.log(state.value)
);
