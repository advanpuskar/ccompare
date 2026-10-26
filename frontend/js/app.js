document.addEventListener("DOMContentLoaded", () => {
    console.log("CCompare JavaScript loaded successfully!");

    const carDetails = {
        "Audi A4": {
            pros: [
                "A comfortable car suitable for long travels",
                "Luxurious interior",
                "A stable car that makes you feel confident behind the wheel",
                "Wide choice of engines and equipment",
                "Amazing balance of comfort and performance"
            ],
            cons: [
                "Maintenance is usually expensive",
                "Reliability varies by engine and model year",
                "Some repairs may require specialist knowledge",
                "Rear space varies by generation",
                "Older examples may need more expensive and time consuming repairs"
            ]
        },

        "Mercedes-Benz C-class": {
            pros: [
                "Elegant design",
                "A comfortable car",
                "Refined motorway driving",
                "Wide range of engine options",
                "Confidence is guaranteed"
            ],
            cons: [
                "Parts and maintenance may be expensive",
                "Some versions have complex electronics",
                "Optional equipment can increase the price",
                "Rear space varies by generation",
                "Repairs can be costly on older examples"
            ]
        },

        "Volkswagen Golf Variant": {
            pros: [
                "Practical luggage compartment",
                "A reliable family car",
                "More cargo space than the Golf hatchback",
                "Good everyday practicality",
                "Wide choice of engines and used examples"
            ],
            cons: [
                "Longer body can make parking harder",
                "Reliability varies by engine and model year",
                "Maintenance costs vary between versions",
                "Older examples may need suspension repairs",
                "Less compact than a Golf hatchback"
            ]
        }
    };

    const navigationLinks = document.querySelectorAll(
        '.header a[href^="#"], .hero a[href^="#"], .form-note a[href^="#"]'
    );

    navigationLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    const searchBox = document.querySelector(".search-box");
    const searchInput = searchBox?.querySelector("input");
    const brandSelect = searchBox?.querySelector("select");
    const searchButton = searchBox?.querySelector("button");
    const carCards = document.querySelectorAll(".car-card");

    function filterCars() {
        if (!searchBox || !searchInput || !brandSelect) return;

        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedBrand = brandSelect.value.toLowerCase().trim();

        let visibleCars = 0;

        carCards.forEach((card) => {
            const heading = card.querySelector("h3, h2");
            const categoryElement = card.querySelector(".kategorija");

            const carName = heading
                ? heading.textContent.toLowerCase()
                : "";

            const category = categoryElement
                ? categoryElement.textContent.toLowerCase()
                : "";

            let brand = "";

            if (
                carName.includes("volkswagen") ||
                carName.includes("golf") ||
                carName.includes("vw")
            ) {
                brand = "volkswagen";
            } else if (carName.includes("audi")) {
                brand = "audi";
            } else if (carName.includes("bmw")) {
                brand = "bmw";
            } else if (carName.includes("mercedes")) {
                brand = "mercedes-benz";
            }

            const matchesSearch =
                carName.includes(searchTerm) ||
                category.includes(searchTerm);

            const matchesBrand =
                selectedBrand === "" ||
                brand === selectedBrand ||
                (
                    selectedBrand.includes("volkswagen") &&
                    brand === "volkswagen"
                ) ||
                (
                    selectedBrand.includes("mercedes") &&
                    brand === "mercedes-benz"
                );

            const isVisible = matchesSearch && matchesBrand;

            card.hidden = !isVisible;

            if (isVisible) visibleCars++;
        });

        let resultMessage = document.querySelector("#search-results");

        if (!resultMessage) {
            resultMessage = document.createElement("p");
            resultMessage.id = "search-results";
            resultMessage.setAttribute("aria-live", "polite");
            searchBox.insertAdjacentElement("afterend", resultMessage);
        }

        resultMessage.textContent = visibleCars === 1
            ? "Found 1 car."
            : `Found ${visibleCars} cars.`;
    }

    searchInput?.addEventListener("input", filterCars);
    brandSelect?.addEventListener("change", filterCars);
    searchButton?.addEventListener("click", filterCars);

    searchInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            filterCars();
        }
    });

    const compareSection = document.querySelector("#compare");
    const compareButton = compareSection?.querySelector(".primary-btn");

    const selectedCars = new Map();

    let comparisonContent = null;
    let comparisonMessage = null;

    if (compareSection) {
        comparisonContent = document.createElement("div");
        comparisonContent.id = "comparison-content";
        comparisonContent.className = "comparison-grid";

        comparisonMessage = document.createElement("p");
        comparisonMessage.className = "comparison-message";
        comparisonMessage.setAttribute("aria-live", "polite");

        compareSection.appendChild(comparisonMessage);
        compareSection.appendChild(comparisonContent);
    }

    function getCarDetailsKey(carName) {
        const name = carName.toLowerCase();

        if (name.includes("audi a4")) {
            return "Audi A4";
        }

        if (name.includes("mercedes")) {
            return "Mercedes-Benz C-class";
        }

        if (
            name.includes("golf") ||
            name.includes("volkswagen") ||
            name.includes("vw")
        ) {
            return "Volkswagen Golf Variant";
        }

        return carName;
    }

    function createList(titleText, items, className) {
        const container = document.createElement("div");
        container.className = className;

        const heading = document.createElement("h4");
        heading.textContent = titleText;

        const list = document.createElement("ul");

        items.forEach((itemText) => {
            const item = document.createElement("li");
            item.textContent = itemText;
            list.appendChild(item);
        });

        container.append(heading, list);

        return container;
    }

    function updateComparison() {
        if (!comparisonContent || !comparisonMessage) return;

        comparisonContent.replaceChildren();

        if (selectedCars.size === 0) {
            comparisonMessage.textContent =
                "No cars selected yet. Choose a car below to start comparing.";
            return;
        }

        comparisonMessage.textContent =
            `You selected ${selectedCars.size} of 2 cars.`;

        selectedCars.forEach((car, carName) => {
            const card = document.createElement("article");
            card.className = "comparison-card";

            const title = document.createElement("h3");
            title.textContent = carName;
            card.appendChild(title);

            const detailsKey = getCarDetailsKey(carName);
            const details = carDetails[detailsKey];

            if (details) {
                card.appendChild(
                    createList(
                        "✓ 5 Advantages",
                        details.pros,
                        "pros-section"
                    )
                );

                card.appendChild(
                    createList(
                        "✕ 5 Disadvantages",
                        details.cons,
                        "cons-section"
                    )
                );
            } else {
                const message = document.createElement("p");
                message.textContent =
                    "Advantages and disadvantages are not available for this car yet.";
                card.appendChild(message);
            }

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-car-btn";
            removeButton.textContent = "Remove car";

            removeButton.addEventListener("click", () => {
                selectedCars.delete(carName);
                updateComparison();
                updateCarButtons();
            });

            card.appendChild(removeButton);
            comparisonContent.appendChild(card);
        });
    }

    function updateCarButtons() {
        carCards.forEach((card) => {
            const link = card.querySelector(".card-link");
            const heading = card.querySelector("h3, h2");

            if (!link || !heading) return;

            const carName = heading.textContent.trim();
            const isSelected = selectedCars.has(carName);

            link.textContent = isSelected
                ? "Remove from Compare"
                : "Add to Compare →";

            link.classList.toggle("selected-for-compare", isSelected);
        });
    }

    carCards.forEach((card) => {
        const link = card.querySelector(".card-link");
        const heading = card.querySelector("h3, h2");
        const categoryElement = card.querySelector(".kategorija");
        const descriptionElement = card.querySelector(".info p");

        if (!link || !heading) return;

        const carName = heading.textContent.trim();

        const category = categoryElement
            ? categoryElement.textContent.trim()
            : "Car";

        const description = descriptionElement
            ? descriptionElement.textContent.trim()
            : "";

        link.addEventListener("click", (event) => {
            event.preventDefault();

            if (selectedCars.has(carName)) {
                selectedCars.delete(carName);
            } else {
                if (selectedCars.size >= 2) {
                    alert("You can compare up to 2 cars at a time.");
                    return;
                }

                selectedCars.set(carName, {
                    category,
                    description
                });
            }

            updateComparison();
            updateCarButtons();
        });
    });

    compareButton?.addEventListener("click", (event) => {
        event.preventDefault();

        const carsSection = document.querySelector("#cars");

        if (carsSection) {
            carsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });

    updateComparison();

    const loginSection = document.querySelector("#login");
    const loginButton = loginSection?.querySelector("button");
    const loginEmail = document.querySelector("#login-email");
    const loginPassword = document.querySelector("#login-password");

    loginButton?.addEventListener("click", () => {
        if (!loginEmail?.value.trim() || !loginPassword?.value) {
            alert("Please enter your email address and password.");
            return;
        }

        if (!loginEmail.checkValidity()) {
            alert("Please enter a valid email address.");
            return;
        }

        alert(
            "Your form is valid! Actual login will be connected to the backend in a later milestone."
        );
    });

    const registerSection = document.querySelector("#register");
    const registerButton = registerSection?.querySelector("button");
    const registerName = document.querySelector("#register-name");
    const registerEmail = document.querySelector("#register-email");
    const registerPassword = document.querySelector("#register-password");

    registerButton?.addEventListener("click", () => {
        if (
            !registerName?.value.trim() ||
            !registerEmail?.value.trim() ||
            !registerPassword?.value
        ) {
            alert("Please fill in all registration fields.");
            return;
        }

        if (!registerEmail.checkValidity()) {
            alert("Please enter a valid email address.");
            return;
        }

        if (registerPassword.value.length < 8) {
            alert("Password must contain at least 8 characters.");
            return;
        }

        alert(
            "Your form is valid! Actual registration will be connected to the backend in a later milestone."
        );
    });
});