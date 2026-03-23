import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  standalone:false,
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements OnInit {
  contacts: any[] = [];

  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.adminService.getAllContacts()
      .subscribe(data => this.contacts = data);
  }

  viewMessage(contact: any): void {
    alert("Message from " + contact.name + " : " + contact.message);
  }

}