import $ from 'jquery';

class MyNotes {
	constructor() {
		this.events();
	}

	events() {
		$('.delete-note').on('click', this.deleteNote);
		$('.edit-note').on('click', this.editNote);
	}

	deleteNote(e) {
		const thisNote = $(e.target).parents('li');

		$.ajax({
			beforeSend: xhr => {
				xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
			},
			url:
				universityData.root_url +
				'/wp-json/wp/v2/note/' +
				thisNote.data('id'),
			type: 'DELETE',
			success: res => {
				thisNote.slideUp();
				console.log('delete');
				console.log(res);
			},
			error: res => {
				console.log('sorry');
				console.log(res);
			}
		});
	}

	editNote(e) {
		const thisNote = $(e.target).parents('li');
		thisNote
			.find('.note-title-field, .note-body-field')
			.removeAttr('readonly')
			.addClass('note-active-field');
		thisNote.find('.update-note').addClass('update-note--visible');
	}
}

export default MyNotes;
