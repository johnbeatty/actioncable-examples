import { Controller } from "stimulus"
import createChannel from "cables/cable";

export default class extends Controller {
  static targets = [ "comments" ]
  
  initialize() {
    let commentsController = this;
    this.commentsChannel = createChannel( "CommentsChannel", {
      connected() {
        commentsController.listen()
      },
      received(data) {
        let html = new DOMParser().parseFromString( data['comment'] , 'text/html');
        const commentHTML = html.body.firstChild;
        if (getCurrentUserId() != commentHTML.getAttribute('data-user-id'))  {
          commentsController.commentsTarget.insertAdjacentElement('beforeend', commentHTML );
        }
      }
    });

  }

  connect() {
    this.listen()
  }

  disconnect() {
    this.commentsChannel.perform('unfollow')
  }

  listen() {
    if (this.commentsChannel) {
      this.commentsChannel.perform('follow', { message_id: this.data.get('id') } )
    }
  }
}

function getCurrentUserId() {
  const element = document.head.querySelector(`meta[name="current-user"]`)
  return element.getAttribute("id")
}