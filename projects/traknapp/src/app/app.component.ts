import { Component, HostBinding } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {
  @HostBinding("class")
  protected readonly hostClass = "w-full h-full";

  title = "Trakn";
}
