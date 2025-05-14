const API_BASE_URL = "http://localhost:8080";
const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");

// Form Load 이벤트 처리하기
document.addEventListener("DOMContentLoaded", function () {
  LoadBook();
});

//Form Submit 이벤트 처리하기
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("Form 제출 되었음");

  //FormData 객체 생성 <form> 엘리먼트를 객체로 변환
  const bookFormData = new FormData(bookForm);
  bookFormData.forEach((value, key) => {
    console.log(key + "=" + value);
  });

  // 사요자 정의 객체
  const bookData = {
    title: bookFormData.get("title").trim(),
    bookId: bookFormData.get("bookId").trim(),
    author: bookFormData.get("author").trim(),
    isbn: bookFormData.get("isbn").trim(),
    price: bookFormData.get("price").trim(),
    publishDate: bookFormData.get("publishDate"),
  };

  // 유효성 체크하기
  if (!validateBook(bookData)) {
    return;
  }
  console.log(bookData);
});

// 데이터 유효성 검사]
function validateBook(book) {
  //필수 필드 검사
  if (!book.title) {
    alert("제목을 입력해주세요.");
    return false;
  }

  if (!book.bookId) {
    alert("bookId를 입력해주세요.");
    return false;
  }

  if (!book.author) {
    alert("저자를 입력해주세요.");
    return false;
  }

  if (!book.isbn) {
    alert("isbn을 입력해주세요.");
    return false;
  }

  if (!book.price) {
    alert("가격을 입력해주세요.");
    return false;
  }

  // bookID 형식 검사 (예: 영문과 숫자 조합)
  const bookIdPattern = /^s\d{5}$/;
  if (!bookIdPattern.test(book.bookId)) {
    alert("bookId는 영문과 숫자만 입력 가능합니다.");
    return false;
  }

  return true;
}

// 책 목록을 Load하는 함수
function LoadBook() {
  console.log("Loading Books ... ");
}
