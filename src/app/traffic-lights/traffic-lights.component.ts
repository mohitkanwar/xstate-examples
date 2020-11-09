import { Component, OnInit } from '@angular/core';
import { Machine, interpret } from 'xstate';

@Component({
  selector: 'app-traffic-lights',
  templateUrl: './traffic-lights.component.html',
  styleUrls: ['./traffic-lights.component.css']
})
export class TrafficLightsComponent implements OnInit {
  public state: string;
  public pedState: string;
  constructor() { }

  ngOnInit() {
    trafficLightService.start();
    trafficLightService.onTransition(state => {
      this.state = state.value.toString();
      if (state.value.hasOwnProperty('stop')){
        this.state = 'stop';
        // tslint:disable-next-line:no-string-literal
        this.pedState = state.value['stop'];
        console.log(this.pedState);
      }
    }
  );
    setInterval(() => trafficLightService.send('TIMEOUT'), 1000);

}
}
const pedestrianStates = {
  initial: 'walk',
  states: {
    walk: {
      on: {
        TIMEOUT: 'wait'
      }
    },
    wait: {
      on: {
        TIMEOUT: 'stop'
      }
    },
    stop: {}
  }
};
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
      },
      ...pedestrianStates
    }
  }
});

const trafficLightService = interpret(trafficLightMachine);
