import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { ScriptService } from 'ngx-script-loader';
import '../assets/js/stisla.js';
import '../assets/js/scripts.js';
import '../assets/js/custom.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'PosVenta';
  token = '';
  loading = true;

  constructor(
    public userService: UserService,
    private router: Router,
    private scriptService: ScriptService
  ) {

  }

  ngOnInit() {
    console.log(this.router.url);
  }

  ngAfterViewInit(): void {

    //this.userService.loadJS();
  }

  logout() {
    this.userService.logout();
  }


  test() {

    if (window.screen.width > 1024) {

      let classSetted = document.getElementsByTagName('body')[0].classList.contains('sidebar-mini');

      classSetted
        ? document.getElementsByTagName('body')[0].classList.remove('sidebar-mini')
        : document.getElementsByTagName('body')[0].classList.add('sidebar-mini');
    } else {

      let classSetted = document.getElementsByTagName('body')[0].classList.contains('sidebar-gone');

      if (classSetted) {
        document.getElementsByTagName('body')[0].classList.remove('sidebar-gone');
        document.getElementsByTagName('body')[0].classList.add('sidebar-show');
      } else {
        document.getElementsByTagName('body')[0].classList.remove('sidebar-show');
        document.getElementsByTagName('body')[0].classList.add('sidebar-gone');
      }

    }

  }

}
