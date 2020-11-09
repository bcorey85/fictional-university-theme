import $ from 'jquery';

class MyNotes {
	constructor() {
		this.events();
	}

	events() {
		$('.delete-note').on('click', this.deleteNote);
		$('.edit-note').on('click', this.editNote.bind(this));
		$('.update-note').on('click', this.updateNote.bind(this));
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

		if (thisNote.data('state') === 'editable') {
			this.makeNoteReadOnly(thisNote);
		} else {
			this.makeNoteEditable(thisNote);
		}
	}

	makeNoteEditable(thisNote) {
		thisNote
			.find('.edit-note')
			.html("<i class='fa fa-times' aria-hidden='trues'></i> Cancel");
		thisNote
			.find('.note-title-field, .note-body-field')
			.removeAttr('readonly')
			.addClass('note-active-field');
		thisNote.find('.update-note').addClass('update-note--visible');
		thisNote.data('state', 'editable');
	}

	makeNoteReadOnly(thisNote) {
		thisNote
			.find('.edit-note')
			.html("<i class='fa fa-pencil' aria-hidden='trues'></i> Edit");
		thisNote
			.find('.note-title-field, .note-body-field')
			.attr('readonly', 'readonly')
			.removeClass('note-active-field');
		thisNote.find('.update-note').removeClass('update-note--visible');
		thisNote.data('state', 'cancel');
	}

	updateNote(e) {
		const thisNote = $(e.target).parents('li');

		const updatedPost = {
			title: thisNote.find('.note-title-field').val(),
			content: thisNote.find('.note-body-field').val()
		};

		$.ajax({
			beforeSend: xhr => {
				xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
			},
			url:
				universityData.root_url +
				'/wp-json/wp/v2/note/' +
				thisNote.data('id'),
			type: 'POST',
			data: updatedPost,
			success: res => {
				this.makeNoteReadOnly(thisNote);
				console.log(res);
			},
			error: res => {
				console.log('sorry');
				console.log(res);
			}
		});
	}
}

export default MyNotes;
