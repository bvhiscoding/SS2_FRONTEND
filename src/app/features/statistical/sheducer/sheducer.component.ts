import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sheducer',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    FullCalendarModule
  ],
  templateUrl: './sheducer.component.html',
  styleUrls: ['./sheducer.component.scss']
})
export class SheducerComponent implements OnChanges {
  @Input() slectionArray: any = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [], // Dữ liệu mặc định rỗng
    eventClick: this.handleEventClick.bind(this),
  };

  selectedEvent: any = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['slectionArray'] && this.slectionArray && this.slectionArray.length > 0) {
      // Chuyển đổi dữ liệu
      const formattedEvents = this.slectionArray.map((event: any) => ({
        title: event.voteName,
        start: event.startDate,
      }));

      this.calendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin],
        events: formattedEvents,
        eventDisplay: 'block', // Hiển thị tiêu đề sự kiện mà không có thời gian
        displayEventTime: false, // Tắt hiển thị thời gian trong sự kiện
        eventClick: this.handleEventClick.bind(this),
      };
    }
  }

  handleEventClick(info: any) {
    this.selectedEvent = {
      title: info.event.title || 'No Title',
      start: info.event.start?.toISOString().split('T')[0],
    };
  }
}
