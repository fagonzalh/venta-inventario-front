import { Component, OnInit } from '@angular/core';
import { ScriptService } from 'ngx-script-loader';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public userService: UserService,
    private scriptService: ScriptService
  ) { }

  ngOnInit() {

  }

}
