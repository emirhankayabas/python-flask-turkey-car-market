// Cevaplar
const answers = {};

// Sorular
const questionList = [
  {
    key: "Marka",
    question: "Hangi marka araba istersiniz?",
    options: [
      "Jaguar",
      "Acura",
      "Jeep",
      "Hyundai",
      "Alfa Romeo",
      "Audi",
      "Mercedes",
      "Volkswagen",
      "Land Rover",
      "BMW",
      "Dacia",
      "Renault",
      "Fiat",
      "Ford",
      "Honda",
      "Kia",
      "Mazda",
      "Mini",
      "Nissan",
      "Opel",
      "Peugeot",
      "Porsche",
      "Seat",
      "Skoda",
      "Isuzu",
      "Chevrolet",
      "Citroen",
      "Chrysler",
      "Infiniti",
      "Lada",
      "Maserati",
    ],
  },
  {
    key: "Yakit",
    question: "Hangi yakıt türünü tercih edersiniz?",
    options: ["Benzin", "Benzin/LPG", "Dizel", "Elektrik", "Hibri"],
  },
  {
    key: "Renk",
    question: "Hangi renk araba istersiniz?",
    options: [
      "Lacivert",
      "Mavi",
      "Turkuaz",
      "Kahverengi",
      "Beyaz",
      "Siyah",
      "Kırmızı",
      "Yeşil",
      "Gri",
      "Gümüş Gri",
      "Mor",
      "Turuncu",
      "Pembe",
      "Füme",
    ],
  },
  {
    key: "Vites",
    question: "Hangi vites tipini istersiniz?",
    options: ["Düz Vites", "Yarı Otomatik Vites", "Otomatik Vites"],
  },
  {
    key: "Durum",
    question: "Aracınızın durumu nedir?",
    options: ["0 km", "2. El", "Hasarlı"],
  },
];

// Soru indexi
let currentQuestionIndex = 0;

// Soru Aşaması - Soruları göster
function showQuestion() {
  const currentQuestion = questionList[currentQuestionIndex];
  const questionDiv = document.getElementById("questions");
  questionDiv.innerHTML = `<p class="headline">${currentQuestion.question}</p>`;

  currentQuestion.options.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.classList.add("button");
    optionButton.textContent = option;
    optionButton.onclick = () => {
      answers[currentQuestion.key] = option;
      currentQuestionIndex++;
      if (currentQuestionIndex < questionList.length) {
        showQuestion();
      } else {
        showResult();
      }
    };
    questionDiv.appendChild(optionButton);
  });
}

function formatFiyat(fiyat, paraBirimi = "TRY", ondalikBasamaklar = 2) {
  return fiyat.toLocaleString("tr-TR", {
    style: "currency",
    currency: paraBirimi,
    minimumFractionDigits: ondalikBasamaklar,
  });
}

// Sonuç Aşaması - Sonuçları göster
function getCars(data, resultParse) {
  const url = "/api/cars" + data;

  $.get(
    url,
    function (response) {
      if (response.length == 0) {
        const questionDiv = document.getElementById("questions");
        questionDiv.innerHTML = "<h2 class='headline'>Sonuçlar</h2>";
        questionDiv.innerHTML = "<h2 class='headline'>Sonuç bulunamadı</h2>";
      }

      if (response.length >= 1) {
        const video = document.getElementById("video");
        const videoSource = document.getElementById("videoSource");

        videoSource.setAttribute("src", `/static/videos/${resultParse[0]}.mp4`);
        video.classList.remove("d-none");
        video.load();
        video.play();

        video.addEventListener("ended", () => {
          video.classList.add("d-none");

          response.forEach((car) => {
            const brand = car["Marka"];
            const model = car["Arac Tip"];
            const fuel = car["Yakıt Turu"];
            const color = car["Renk"];
            const year = car["Model Yıl"];
            const km = car["Km"];
            const price = car["Fiyat"];

            const carDiv = document.createElement("div");
            carDiv.innerHTML = `
          <div class="result">
            <h5>${brand} - ${model}</h5>
            <p><span>Yakıt Türü:</span> ${fuel}</p>
            <p><span>Renk:</span> ${color}</p>
            <p><span>Model Yıl:</span> ${year}</p>
            <p><span>Km:</span> ${km}</p>
            <p><span>Fiyat:</span> ${formatFiyat(price)}</p>
          </div>
          `;
            const questionDiv = document.getElementById("questions");
            questionDiv.appendChild(carDiv);
          });
        });
      }
    },
    "json"  
  );
}

function showResult() {
  const questionDiv = document.getElementById("questions");
  questionDiv.innerHTML = "<h2 class='headline'>Sonuçlar</h2>";

  const result = JSON.stringify(Object.values(answers), null, 2); 
  const resultParse = JSON.parse(result);
  const url = `?marka=${resultParse[0]}&yakit=${resultParse[1]}&renk=${resultParse[2]}&vites=${resultParse[3]}&durum=${resultParse[4]}`;
  getCars(url, resultParse);

  questionDiv.classList.add("scroll");
}

// İlk soruyu göster
showQuestion();
