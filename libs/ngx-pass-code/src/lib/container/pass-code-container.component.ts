import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PassCodeFormService } from '../form/pass-code-form.service';

@Component({
  selector: 'ngx-pass-code',
  templateUrl: './pass-code-container.component.html',
  styleUrls: ['./pass-code-container.component.scss'],
  providers: [PassCodeFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassCodeContainerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
