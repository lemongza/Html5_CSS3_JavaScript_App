// 전역변수 선언
const API_BASE_URL = "http://localhost:8080";
// DOM 엘리먼트 가져오기
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");

// Form Load 이벤트 처리하기
document.addEventListener("DOMContentLoaded", function () {
  //익명 함수
  LoadStudent();
}); //화면이 뜨자마자 처리해줌

//Form Submit 이벤트 처리하기
studentForm.addEventListener("submit", function (event) {
  //기본으로 설정된 event 동작되지 않도록
  event.preventDefault();
  console.log("Form 제출 되었음");

  //FormData 객체 생성 <form> 엘리먼트를 객체로 변환
  const stuFormData = new FormData(studentForm);
  stuFormData.forEach((value, key) => {
    console.log(key + "=" + value);
  });

  // 사용자 정의 Student 객체 생성 (공백 제거)
  const studentData = {
    name: stuFormData.get("name").trim(),
    studentNumber: studentForm.get("studentNumber").trim(),
    address: studentForm.get("address").trim(),
    phoneNumber: stuFormData.get("phoneNumber").trim(),
    email: stuFormData.get("email").trim(),
    dateOfBirth: stuFormData.get("dateOfBirth"),
  };

  // 유효성 체크하기
  if (!validateStudent(studentData)) {
    return;
  }
});

// 데이터 유효성 검사
function validateStudent(student) {}

// 학생 목록을 Load하는 함수
function LoadStudent() {
  console.log("Loading Student ... ");
}
