class Pager {
    constructor(maxContentPerPage, totalContents, currentPage = 1) {
        this.maxContentPerPage = maxContentPerPage;
        this.totalContents = totalContents;
        this.currentPage = currentPage;
    }

    setCurrentPage(currentPage = 1) {
        this.currentPage = Math.min(Math.max(currentPage, 1), this.getMaxPage()) || 1;
    }

    getMaxPage() {
        return Math.ceil(this.totalContents / this.maxContentPerPage);
    }

    getOffset() {
        return (this.currentPage - 1) * this.maxContentPerPage;
    }
}

class MDPager extends Pager {
    constructor(pageID, maxContentPerPage, totalContents, currentPage = 1) {
        super(maxContentPerPage, totalContents, currentPage);
        this.pageID = pageID;
        this.el = document.getElementById(pageID);
    }

    #showPaginationText() {
        return `Page ${this.currentPage} of ${this.getMaxPage()}`;
    }

    displayPaginationText(targetID = 'current-page') {
        const res = this.#showPaginationText();
        this.el.querySelector('#' + targetID).innerText = res;
    }

    #getPageSelector(maxChoices = 7, endAmount = 2) {
        if (maxChoices < 4) {throw TypeError('maxChoices cannot under 4');}
        
        // startRange Count
        const maxPage = this.getMaxPage();
        
        let inputBoxAddition = true;
        if (maxPage == maxChoices) {
            inputBoxAddition = false;
        }

        const startAmount = maxChoices - endAmount - inputBoxAddition
        
        let startRangeStart = 1;
        if (this.currentPage >= startAmount - 1) {
            startRangeStart = this.currentPage - 1;
        }

        let startRangeEnd = startRangeStart + startAmount - 1;

        let displayEndPage = true;
        
        if (startRangeEnd > maxPage) {
            displayEndPage = false;
            startRangeEnd = maxPage;
            startRangeStart = maxPage - startAmount + 1;
        }

        // end range count
        let endRangeStart = maxPage - endAmount + 1;
        let endRangeEnd = maxPage;
        
        if (startRangeEnd == endRangeStart) {
            endRangeStart++;
        }

        if (!displayEndPage || startRangeEnd > endRangeStart) {
            endRangeStart = endRangeEnd = null;
            startRangeStart--;
        }

        // recheck again

        return {
            'startRange': {
                'start': startRangeStart,
                'end': startRangeEnd
            },
            'endRange': {
                'start': endRangeStart,
                'end': endRangeEnd
            },
            'pageInputAddition': inputBoxAddition
        }
    }

    #maxChoices; #endAmount; #displayPaginationTextID; #onClickCallback;

    generatePageSelector(maxChoices = 7, endAmount = 2, displayPaginationTextID = 'current-page', onClickCallback = "setCurrentPage(this.getAttribute('data-page'))") {
        // save config
        this.#maxChoices = maxChoices;
        this.#endAmount = endAmount;
        this.#displayPaginationTextID = displayPaginationTextID;
        this.#onClickCallback = onClickCallback;

        // get referenced
        const ref = this.#getPageSelector(maxChoices, endAmount)
        
        // DOM
        function createElement(element = 'span', text = null, classes = null, id = null, ...config) {
            const el = document.createElement(element);
            if (text != null) {el.innerHTML = text}
            if (id != null) {el.id = id;}
            if (classes != null) {
                classes.split(' ').forEach(item => {
                    el.classList.add(item)
                });
            }
            return el;
        }
        
        // DOM
        const pageSelector = this.el.querySelector('.pagination > .page-selector');
        const listOfPaginatorStart = [];
        const listOfPaginatorEnd = [];
        
        for (let i = ref.startRange.start; i <= ref.startRange.end; i++) {
            const element = createElement('div', i, 'page-selector-item');
            element.setAttribute('data-page', i);
            element.setAttribute('onclick', onClickCallback);
            if (this.currentPage == i) {element.classList.add('active');}
            listOfPaginatorStart.push(element);
        }

        if (ref.endRange.start != null && ref.endRange.end != null) {
            for (let i = ref.endRange.start; i <= ref.endRange.end; i++) {
                const element = createElement('div', i, 'page-selector-item');
                element.setAttribute('data-page', i);
                element.setAttribute('onclick', onClickCallback);
                if (this.currentPage == i) {element.classList.add('active');}
                listOfPaginatorEnd.push(element);
            }
        }
        
        const finalize = [...listOfPaginatorStart];
        
        if (ref.pageInputAddition) {
            const inputBox = document.createElement('input')
            inputBox.type = 'text';
            inputBox.classList.add('page-selector-item');
            inputBox.setAttribute('placeholder', '...');
            inputBox.setAttribute('onkeyup', `this.setAttribute('data-page', this.value);${onClickCallback}`);
            finalize.push(inputBox);
        }
        
        finalize.push(...listOfPaginatorEnd);
        
        finalize.forEach(el => {
            pageSelector.appendChild(el);
        });

        // check if current-page id exists or not
        const currentPageText = document.getElementById(displayPaginationTextID);
        if (currentPageText) {
            currentPageText.innerText = this.#showPaginationText();
        }

        const previousPage = document.querySelector('.previous-page');
        if (previousPage) {
            previousPage.setAttribute('data-page', parseInt(this.currentPage) - 1);
            previousPage.setAttribute('onclick', onClickCallback);
        }

        const nextPage = document.querySelector('.next-page');
        if (nextPage) {
            nextPage.setAttribute('data-page', parseInt(this.currentPage) + 1);
            nextPage.setAttribute('onclick', onClickCallback);
        }

        return true;
    }

    setCurrentPage(currentPage) {
        super.setCurrentPage(currentPage);
        const pageSelector = this.el.querySelector('.pagination > .page-selector');
        while (pageSelector.firstChild) {pageSelector.removeChild(pageSelector.lastChild);}
        this.generatePageSelector(this.#maxChoices, this.#endAmount, this.#displayPaginationTextID, this.#onClickCallback);
        return true;
    }
}