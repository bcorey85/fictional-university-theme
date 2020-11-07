import $ from 'jquery';

class Search {
	constructor() {
		this.resultsDiv = $('#search-overlay__results');
		this.openButton = $('.js-search-trigger');
		this.closeButton = $('.search-overlay__close');
		this.searchOverlay = $('.search-overlay');
		this.searchTerm = $('#search-term');
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
		this.searchTerm.on('keyup', this.typingLogic.bind(this));
	}

	openOverlay() {
		this.searchOverlay.addClass('search-overlay--active');
		$('body').addClass('body-no-scroll');
		this.isOverlayOpen = true;
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
		if (this.searchTerm.val() !== this.previousSearchValue) {
			clearTimeout(this.typingTimer);

			if (this.searchTerm.val()) {
				if (!this.isSpinnerVisible) {
					this.resultsDiv.html('<div class="spinner-loader"></div>');
					this.isSpinnerVisible = true;
				}
				this.typingTimer = setTimeout(this.getResults.bind(this), 2000);
			} else {
				this.resultsDiv.html('');
				this.isSpinnerVisible = false;
			}
		}

		this.previousSearchValue = this.searchTerm.val();
	}

	getResults() {
		this.resultsDiv.html('<div>results here</div>');
		this.isSpinnerVisible = false;
	}
}

export default Search;
