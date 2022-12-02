import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-pass-code',
  templateUrl: './pass-code-container.component.html',
  styleUrls: ['./pass-code-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassCodeContainerComponent implements OnInit {
  @Input() passCodeLength = 0;

  passCodes!: FormArray<FormControl>;

  constructor() {}

  ngOnInit(): void {
    this.passCodes = new FormArray(
      Array(this.passCodeLength).fill(new FormControl(''))
    );
  }
}
