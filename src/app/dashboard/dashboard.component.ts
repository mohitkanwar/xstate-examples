import { Component, OnInit } from '@angular/core';
import { Machine, interpret } from 'xstate';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public state: string;
  public pedState: string;
  constructor() { }

  ngOnInit() {
    dashboardService.start();
    dashboardService.onTransition(state => {
      this.state = state.value.toString();
      if (state.value.hasOwnProperty('stop')){
        this.state = 'stop';
        // tslint:disable-next-line:no-string-literal
        this.pedState = state.value['stop'];
        console.log(this.pedState);
      }
    }
  );
    setInterval(() => dashboardService.send('TIMEOUT'), 1000);

}
}
const tncNotAccepted = () => false;

const dashboardMachine = Machine({
  id: 'dashboard',
  initial: 'anonymous',
  context: {
    tncNotAccepted: true,
    pwdChangeRequest: false,
    isAdmin: false
  },
  states: {
    anonymous: {
      on : {
        LOGIN: [
          {
          target: 'tnc',
          cond: (context, event) => context.tncNotAccepted
        },
        {
          target: 'pwdChange' ,
          cond: (context, event) => !context.tncNotAccepted && context.pwdChangeRequest
        },
        {
          target: 'dashboard' ,
          cond: (context, event) => !context.tncNotAccepted && !context.pwdChangeRequest && !context.isAdmin
        },
        {
          target: 'adminDashboard' ,
          cond: (context, event) => !context.tncNotAccepted && !context.pwdChangeRequest && context.isAdmin
        }
      ]
      }
    },
    tnc: {
      on : {
        TNCACCEPT: [
          {
            target: 'pwdChange' ,
            cond: (context, event) => !context.tncNotAccepted && context.pwdChangeRequest
          },
          {
            target: 'dashboard' ,
            cond: (context, event) => !context.tncNotAccepted && !context.pwdChangeRequest && !context.isAdmin
          },
          {
            target: 'adminDashboard' ,
            cond: (context, event) => !context.tncNotAccepted && !context.pwdChangeRequest && context.isAdmin
          }
        ]
      }
    },
    pwdChange: {
      on: {
        CHANGEPWD: [
          {
            target: 'dashboard' ,
            cond: (context, event) => !context.tncNotAccepted && !context.pwdChangeRequest && !context.isAdmin
          },
          {
            target: 'adminDashboard' ,
            cond: (context, event) => !context.tncNotAccepted && !context.pwdChangeRequest && context.isAdmin
          }
        ]
      }
    },
    dashboard: {
    },
    adminDashboard: {
    },
  }
}, {
  guards: {
    tncNotAccepted
  }
});

const dashboardService = interpret(dashboardMachine);
