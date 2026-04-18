import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input
} from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-markup'

type CodeLanguage = 'typescript' | 'markup'

@Component({
  selector: 'ngx-libs-workspace-code-block',
  templateUrl: './code-block.component.html',
  styleUrls: ['./code-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class CodeBlockComponent {
  readonly code = input.required<string>()
  readonly language = input<CodeLanguage>('typescript')

  private readonly sanitizer = inject(DomSanitizer)

  protected readonly highlighted = computed<SafeHtml>(() => {
    const lang = this.language()
    const grammar = Prism.languages[lang]
    const html = Prism.highlight(this.code(), grammar, lang)
    return this.sanitizer.bypassSecurityTrustHtml(html)
  })
}
