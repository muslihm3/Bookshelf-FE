const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const MOVED_EVENT = "moved-book";
const DELETED_EVENT = "deleted-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
const books = [];

const isStorageExist = () => {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung web storage");
      return false;
    }
    return true;
};


document.addEventListener(RENDER_EVENT, () => {
const unfinishedBook = document.getElementById("incompleteBookshelfList");
unfinishedBook.innerHTML = "";

const finishedBook = document.getElementById("completeBookshelfList");
finishedBook.innerHTML = "";

for (const bookItem of books) {
    const bookElement = makeBookElement(bookItem);
    if (!bookItem.isComplete) {
    unfinishedBook.append(bookElement);
    } else {
    finishedBook.append(bookElement);
    }
  }
}); 

document.addEventListener(SAVED_EVENT, () => {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("alert");
    elementCustomAlert.innerText = "Berhasil Disimpan!";
  
    document.body.insertBefore(elementCustomAlert, document.body.children[1]);
    setTimeout(() => {
      elementCustomAlert.remove();
    }, 2000);
} );

document.addEventListener(MOVED_EVENT, () => {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("alert");
    elementCustomAlert.innerText = "Berhasil Dipindahkan!";
  
    document.body.insertBefore(elementCustomAlert, document.body.children[1]);
    setTimeout(() => {
      elementCustomAlert.remove();
    }, 2000);
} );

document.addEventListener(DELETED_EVENT, () => {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("alert");
    elementCustomAlert.innerText = "Berhasil Dihapus!";

    document.body.insertBefore(elementCustomAlert, document.body.children[1]);
    setTimeout(() => {
        elementCustomAlert.remove();
    }, 2000);
} );

const loadDataFromStorage = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
    if (data !== null) {
      for (const item of data) {
        books.push(item);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

const moveData = () => {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(MOVED_EVENT));
    }
};

const deleteData = () => {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(DELETED_EVENT));
    }
};

const addBook = () => {
    const bookTitle = document.getElementById("inputBookTitle");
    const bookAuthor = document.getElementById("inputBookAuthor");
    const bookYear = document.getElementById("inputBookYear");
    const bookHasFinished = document.getElementById("inputBookIsComplete");
    let bookStatus;
  
    if (bookHasFinished.checked) {
      bookStatus = true;
    } else {
      bookStatus = false;
    }
  
    books.push({
      id: +new Date(),
      title: bookTitle.value,
      author: bookAuthor.value,
      year: Number(bookYear.value),
      isComplete: bookStatus,
    });
  
    bookTitle.value = null;
    bookAuthor.value = null;
    bookYear.value = null;
    bookHasFinished.checked = false;
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};
  
const makeBookElement = (bookObject) => {
    const elementBookTitle = document.createElement("h3");
    elementBookTitle.classList.add("item_title");
    elementBookTitle.innerHTML = bookObject.title;
  
    const elementBookAuthor = document.createElement("p");
    elementBookAuthor.classList.add("item_writer");
    elementBookAuthor.innerText = bookObject.author;

    const elementBookYear = document.createElement("p");
    elementBookYear.classList.add("item_year");
    elementBookYear.innerText = bookObject.year;
  
    const descContainer = document.createElement("article");
    descContainer.classList.add("book_item");
    descContainer.append(elementBookTitle, elementBookAuthor, elementBookYear);
  
    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");
  
    const container = document.createElement("div");
    container.classList.add("item");
    container.append(descContainer);
    container.setAttribute("id", `book-${bookObject.id}`);
  
    if (bookObject.isComplete) {
      const returnBtn = document.createElement("button");
      returnBtn.classList.add("green");
      returnBtn.innerHTML = `<i class="fa fa-undo" aria-hidden="true"></i>`;
  
      returnBtn.addEventListener("click", () => {
        returnBookFromFinished(bookObject.id);
      });
  
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("red");
      deleteBtn.innerHTML = `<i class="fa fa-trash" aria-hidden="true"></i>`;
  
      deleteBtn.addEventListener("click", () => {
        deleteBook(bookObject.id);
      });
  
      actionContainer.append(returnBtn, deleteBtn);
      container.append(actionContainer);
    } else {
      const finishBtn = document.createElement("button");
      finishBtn.classList.add("green");
      finishBtn.innerHTML = `<i class="fa fa-check-circle" aria-hidden="true"></i>`;
  
      finishBtn.addEventListener("click", () => {
        addBookToFinished(bookObject.id);
      });
  
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("red");
      deleteBtn.innerHTML = `<i class="fa fa-trash" aria-hidden="true"></i>`;
  
      deleteBtn.addEventListener("click", () => {
        deleteBook(bookObject.id);
      });
  
      actionContainer.append(finishBtn, deleteBtn);
      container.append(actionContainer);
    }
  
    return container;
};

const addBookToFinished = (bookId) => {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
  
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
};

const returnBookFromFinished = (bookId) => {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
};

const deleteBook = (bookId) => {
    const bookTarget = findBookIndex(bookId);
  
    if (bookTarget === -1) return;
  
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    deleteData();
};

const findBook = (bookId) => {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
  
    return null;
};
  
  const findBookIndex = (bookId) => {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
  
    return -1;
};
  
document.addEventListener("DOMContentLoaded", () => {
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  
    const simpanForm = document.getElementById("inputBook");
    simpanForm.addEventListener("submit", (event) => {
      event.preventDefault();
      addBook();
    });
});
  


