import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

import { MomentService } from 'src/app/services/moment.service';
import { Moment } from 'src/app/moment';
import { MessagesService } from 'src/app/services/messages.service';
import { Comment } from 'src/app/comment';
import { CommentService } from 'src/app/services/comment.service';

import { environment } from 'src/environments/environment';

import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-moment',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.css']
})
export class MomentComponent implements OnInit{
  
  faTimes = faTimes
  faEdit = faEdit

  baseApiUrl = environment.baseApiUrl
  moment?: Moment
  
  commentForm!: FormGroup

  constructor(
    private momentService: MomentService,
    private route: ActivatedRoute,
    private messageService: MessagesService,
    private router: Router,
    private commentService: CommentService
  ){}

  ngOnInit(): void {
      const id= Number(this.route.snapshot.paramMap.get("id"))

      this.momentService
      .getMoment(id)
      .subscribe((item) => {this.moment = item.data})

      this.commentForm = new FormGroup({
        text: new FormControl('', [Validators.required]),
        username: new FormControl('', [Validators.required]),
      })
  }

  get text(){
    return this.commentForm.get('text')!
  }

  get username(){
    return this.commentForm.get('username')!
  }

  async removeHandler(id:number){
    await this,this.momentService.removeMoment(id).subscribe()

    this.messageService.add("Moment excluido com sucesso")

    this.router.navigate(['/'])
  }

  async onSubmit(formDirective: FormGroupDirective){
      if(this.commentForm.invalid){
        return
      }

      const data:Comment = this.commentForm.value

      data.momentId = Number(this.moment!.id)

      await this.commentService.createComment(data).subscribe((comment) => this.moment!.comments?.push(comment.data))

      this. messageService.add("Comentário adicionado!")

      /*Reseta o form sem mudar o local*/
      this.commentForm.reset()
      formDirective.resetForm()
  }
}
