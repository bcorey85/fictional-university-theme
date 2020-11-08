import $ from 'jquery';

class Search {
	constructor() {
		this.renderOverlayHTML();
		this.resultsDiv = $('#search-overlay__results');
		this.openButton = $('.js-search-trigger');
		this.closeButton = $('.search-overlay__close');
		this.searchOverlay = $('.search-overlay');
		this.searchField = $('#search-term');
		this.events();
		this.isSpinnerVisible = false;
		this.isOverlayOpen = false;
		this.typingTimer;
		this.previousSearchValue;
	}

	events() {
		this.openButton.on('click', this.openOverlay.bind(this));
		this.closeButton.on('click', this.closeOverlay.bind(this));
		$(document).on('keyup', this.keyPressDispatcher.bind(this));
		this.searchField.on('keyup', this.typingLogic.bind(this));
	}

	openOverlay() {
		this.searchOverlay.addClass('search-overlay--active');
		$('body').addClass('body-no-scroll');
		this.isOverlayOpen = true;
		this.searchField.val('');
		setTimeout(() => {
			this.searchField.focus();
		}, 301);
	}

	closeOverlay() {
		this.searchOverlay.removeClass('search-overlay--active');
		$('body').removeClass('body-no-scroll');
		this.isOverlayOpen = false;
	}

	keyPressDispatcher(e) {
		if (
			e.keyCode === 83 &&
			!this.isOverlayOpen &&
			!$('input, textarea').is(':focus')
		) {
			this.openOverlay();
		}

		if (e.keyCode === 27 && this.isOverlayOpen) {
			this.closeOverlay();
		}
	}

	typingLogic() {
		if (this.searchField.val() !== this.previousSearchValue) {
			clearTimeout(this.typingTimer);

			if (this.searchField.val()) {
				if (!this.isSpinnerVisible) {
					this.resultsDiv.html('<div class="spinner-loader"></div>');
					this.isSpinnerVisible = true;
				}
				this.typingTimer = setTimeout(this.getResults.bind(this), 750);
			} else {
				this.resultsDiv.html('');
				this.isSpinnerVisible = false;
			}
		}

		this.previousSearchValue = this.searchField.val();
	}

	getResults() {
		$.when(
			$.getJSON(
				universityData.root_url +
					'/wp-json/wp/v2/posts?search=' +
					this.searchField.val()
			),
			$.getJSON(
				universityData.root_url +
					'/wp-json/wp/v2/pages?search=' +
					this.searchField.val()
			)
		)
			.then((posts, pages) => {
				var combinedResults = posts[0].concat(pages[0]);
				this.resultsDiv.html(`
					<h2 class="search-overlay__section-title">General Information</h2>
						${combinedResults.length
							? '<ul class="link-list min-list">'
							: '<p>No general information matches that search</p>'}
						${combinedResults
							.map(item => {
								return `<li><a href='${item.link}'>${item.title
									.rendered} ${item.type === 'post'
									? `by ${item.authorName}`
									: ''}</a></li>`;
							})
							.join('')}
					${combinedResults.length ? '</ul>' : ''}
				`);
				this.isSpinnerVisible = false;
			})
			.catch(error => {
				this.resultsDiv.html('<div>Oops! An error occurred.</div>');
			});
	}

	renderOverlayHTML() {
		$('body').append(`
			<div class='search-overlay'>
				<div class='search-overlay__top'>
					<div class='container'>
					<i class='fa fa-search search-overlay__icon' aria-hidden='true'></i>
					<input type='text' class='search-term' placeholder='What are you looking for?' id='search-term' autocomplete='off'>
					<i class='fa fa-window-close search-overlay__close' aria-hidden='true'></i>
					</div>
				</div>
				<div class='container'>
					<div id='search-overlay__results'> </div>
				</div>
			</div>
		`);
	}
}

export default Search;
