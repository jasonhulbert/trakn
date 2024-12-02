import { Component, HostBinding } from '@angular/core'

@Component({
    selector: 'app-dashboard',
    imports: [],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
    @HostBinding('class')
    protected readonly hostClass = 'w-full h-full'
}
