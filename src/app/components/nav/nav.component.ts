import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/interfaces';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  userObservable: Subscription | undefined;
  usuario: User = {};

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userObservable = this.userService.user$.subscribe(res => {
      this.usuario = res;
    })
  }

  logout() {
    this.userService.logout();
  }

}
