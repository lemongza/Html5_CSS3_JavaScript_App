const API_BASE_URL = "http://localhost:8080";
let editingid = null;

const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");
const cancelButton = bookForm.querySelector(".cancel-btn");
const submitButton = bookForm.querySelector('button[type="submit"]');
const formError = document.getElementById("formError");

// Form Load 이벤트 처리하기
document.addEventListener("DOMContentLoaded", function () {
  LoadBook();
});

// Form Submit 이벤트 처리
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("Form 제출됨");

  // FormData 객체 생성
  const bookFormData = new FormData(bookForm);
  bookFormData.forEach((value, key) => {
    console.log(key + "=" + value);
  });

  // 사용자 정의 Book 객체 생성
  const bookData = {
    title: bookFormData.get("title").trim(),
    author: bookFormData.get("author").trim(),
    isbn: bookFormData.get("isbn").trim(),
    price: bookFormData.get("price").trim(),
    publishDate: bookFormData.get("publishDate"),
  };

  // 유효성 체크하기
  if (!validateBook(bookData)) {
    return; //검증 실패할 경우 리턴
  }

  // 수정중인 아이디가 있으면 업데이트
  if (editingid) {
    updateBook(editingid, bookData);
  } //없으면 새로운 책 등록
  else createBook(bookData);
});

// 데이터 유효성 검사]
function validateBook(book) {
  //필수 필드 검사
  if (!book.title) {
    alert("제목을 입력해주세요.");
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

  // // id 형식 검사 (예: 영문과 숫자 조합)
  // const idPattern = /^B\d{5}$/;
  // if (!idPattern.test(book.id)) {
  //   alert("id는 B00001 형태로 입력 가능합니다.");
  //   return false;
  // }

  return true;
}

// 책 목록을 Load하는 함수
function LoadBook() {
  console.log("Loading Books ... ");
  fetch(`${API_BASE_URL}/api/books`) //promise
    .then((response) => {
      if (!response.ok) {
        throw new Error("도서 목록을 불러오는데 실패했습니다.");
      }
      return response.json();
    })
    .then((books) => renderBookTable(books))
    .catch((error) => {
      console.log("Error: " + error);
      alert("도서 목록을 불러오는데 실패했습니다.");
    });
}

// book 목록 동적으로 생성
function renderBookTable(books) {
  bookTableBody.innerHTML = "";
  books.forEach((book) => {
    const row = document.createElement("tr");
    row.innerHTML = `                    
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td>${book.price}</td>
                    <td>${book.publishDate}</td>
                    <td>
                        <button class="edit-btn" onclick="editBook(${book.id})">수정</button>
                        <button class="delete-btn" onclick="deleteBook(${book.id})">삭제</button>
                    </td>
                `;
    bookTableBody.appendChild(row);
  });
}

// book 등록 함수 (POST)
function createBook(bookData) {
  fetch(`${API_BASE_URL}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData), //Object => json
  })
    .then(async (response) => {
      if (!response.ok) {
        //응답 본문을 읽어서 에러 메시지 추출
        const errorData = await response.json();
        //status code와 message를 확인하기
        if (response.status === 409) {
          //중복 오류 처리
          throw new Error(errorData.message || "중복 되는 정보가 있습니다.");
        } else {
          //기타 오류 처리
          throw new Error(errorData.message || "도서 등록에 실패했습니다.");
        }
      }
      return response.json();
    })
    .then((result) => {
      alert("도서가 성공적으로 등록되었습니다!");
      resetForm();
      //목록 새로 고침
      LoadBook();
    })
    .catch((error) => {
      console.log("Error : ", error);
      alert(error.message);
    });
}

// book 삭제 함수 (DELETE)
function deleteBook(id) {
  if (!confirm(`ID = ${id} 인 도서를 정말로 삭제하시겠습니까?`)) {
    return;
  }
  console.log("삭제처리 ...");
  fetch(`${API_BASE_URL}/api/books/${id}`, {
    method: "DELETE",
  }).then(async (response) => {
    if (!response.ok) {
      //응답 본문을 읽어서 에러 메시지 추출
      const errorData = await response.json();
      //status code와 message를 확인하기
      if (response.status === 404) {
        //중복 오류 처리
        throw new Error(errorData.message || "존재하지 않는 도서입니다.");
      } else {
        //기타 오류 처리
        throw new Error(errorData.message || "도서 삭제에 실패했습니다.");
      }
    }
    alert("도서가 성공적으로 삭제되었습니다!");
    //목록 새로 고침
    LoadBook();
  });
}

// 수정할 book load
function editBook(id) {
  fetch(`${API_BASE_URL}/api/books/${id}`)
    .then(async (response) => {
      if (!response.ok) {
        //응답 본문을 읽어서 에러 메시지 추출
        const errorData = await response.json();
        //status code와 message를 확인하기
        if (response.status === 404) {
          //중복 오류 처리
          throw new Error(errorData.message || "존재하지 않는 도서입니다.");
        }
      }
      return response.json();
    })
    .then((book) => {
      //Form에 데이터 채우기
      bookForm.title.value = book.title;
      bookForm.id.value = book.id;
      bookForm.author.value = book.author;
      bookForm.isbn.value = book.isbn;
      bookForm.price.value = book.price;
      bookForm.publishDate.value = book.publishDate;

      //수정 Mode 설정
      editingid = id;
      //버튼의 타이틀을 등록 => 수정으로 변경
      submitButton.textContent = "도서 수정";
      //취소 버튼을 활성화
      cancelButton.style.display = "inline-block";
    })
    .catch((error) => {
      console.log("Error : ", error);
      alert(error.message);
    });
}

// 수정 모드 -> 등록 모드로 초기화
function resetForm() {
  //form 초기화
  bookForm.reset();
  editingid = null;
  submitButton.textContent = "도서 등록";
  //취소 버튼 사라짐
  cancelButton.style.display = "none";
}

// 도서 수정 함수 (PUT)
function updateBook(id, bookData) {
  fetch(`${API_BASE_URL}/api/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData), //Object => json
  })
    .then(async (response) => {
      if (!response.ok) {
        //응답 본문을 읽어서 에러 메시지 추출
        const errorData = await response.json();
        //status code와 message를 확인하기
        if (response.status === 409) {
          //중복 오류 처리
          throw new Error(errorData.message || "중복 되는 정보가 있습니다.");
        } else {
          //기타 오류 처리
          throw new Error(errorData.message || "도서 수정에 실패했습니다.");
        }
      }
      return response.json();
    })
    .then((result) => {
      alert("도서가 성공적으로 수정되었습니다!");
      //등록 모드로 초기화
      resetForm();
      //목록 새로 고침
      LoadBook();
    })
    .catch((error) => {
      console.log("Error : ", error);
      alert(error.message);
    });
}

//성공 메시지 출력
function showSuccess(message) {
  formError.textContent = message;
  formError.style.display = "block";
  formError.style.color = "#28a745";
}
//에러 메시지 출력
function showError(message) {
  formError.textContent = message;
  formError.style.display = "block";
  formError.style.color = "#dc3545";
}
//메시지 초기화
function clearMessages() {
  formError.style.display = "none";
}
