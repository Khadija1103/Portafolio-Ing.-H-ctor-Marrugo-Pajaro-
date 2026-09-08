/* =========================================================
   MARRUGO INGENIERÍA
   SCRIPT.JS COMPLETO
   FormSubmit + carrusel de proyectos + experiencia + modal
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURACIÓN FORMSUBMIT
       ===================================================== */

    const FORMSUBMIT_EMAIL = "hectorrafael1953@yahoo.es";

    const FORMSUBMIT_ENDPOINT =
        `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`;


    /* =====================================================
       MENÚ LATERAL
       ===================================================== */

    const menuItems =
        document.querySelectorAll(".menu-item");

    const sections =
        document.querySelectorAll("main section[id]");


    menuItems.forEach((item) => {

        item.addEventListener("click", () => {

            menuItems.forEach((menu) => {
                menu.classList.remove("active");
            });

            item.classList.add("active");
        });
    });


    /* =====================================================
       MENÚ ACTIVO SEGÚN SCROLL
       ===================================================== */

    function activateMenuOnScroll() {

        const position = window.scrollY + 200;

        sections.forEach((section) => {

            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (
                position >= top &&
                position < top + height
            ) {

                menuItems.forEach((item) => {

                    item.classList.remove("active");

                    if (
                        item.getAttribute("href") === `#${id}`
                    ) {
                        item.classList.add("active");
                    }
                });
            }
        });
    }


    window.addEventListener(
        "scroll",
        activateMenuOnScroll,
        { passive: true }
    );


    /* =====================================================
       ENLACES INTERNOS
       ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener("click", (event) => {

                const targetId = link.getAttribute("href");

                if (!targetId || targetId === "#") {
                    event.preventDefault();
                    return;
                }

                const target = document.querySelector(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        });


    /* =====================================================
       PARALLAX HERO
       ===================================================== */

    const hero = document.querySelector(".hero");
    const heroBg = document.querySelector(".hero-bg");

    if (
        hero &&
        heroBg &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        hero.addEventListener("mousemove", (event) => {

            const rect = hero.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) / rect.width;

            const y =
                (event.clientY - rect.top) / rect.height;

            const moveX = (x - 0.5) * 4;
            const moveY = (y - 0.5) * 2;

            heroBg.style.transform = `
                scale(1.012)
                translate(${moveX}px, ${moveY}px)
            `;
        });

        hero.addEventListener("mouseleave", () => {
            heroBg.style.transform = "scale(1)";
        });
    }


    /* =====================================================
       PROYECTOS DESTACADOS
       ===================================================== */

    const projectSection =
        document.querySelector("#proyectos.projects-section") ||
        document.querySelector(".projects-section");

    const projectGrid =
        projectSection
            ? projectSection.querySelector(".projects-grid")
            : null;

    const projectPrev =
        document.getElementById("projectPrev");

    const projectNext =
        document.getElementById("projectNext");

    const projectCards =
        projectGrid
            ? Array.from(projectGrid.querySelectorAll(".project-card"))
            : [];

    let projectViewport = null;
    let projectIndex = 0;


    function getVisibleProjectCards() {

        const width = window.innerWidth;

        if (width <= 600) {
            return 1;
        }

        if (width <= 1200) {
            return 2;
        }

        return 3;
    }


    function getProjectMaxIndex() {

        const visible = getVisibleProjectCards();

        return Math.max(
            0,
            projectCards.length - visible
        );
    }


    function updateProjectButtons() {

        if (!projectPrev || !projectNext) {
            return;
        }

        const max = getProjectMaxIndex();

        const atStart = projectIndex <= 0;
        const atEnd = projectIndex >= max;

        projectPrev.disabled = atStart;
        projectNext.disabled = atEnd;

        projectPrev.style.opacity = atStart ? "0.35" : "1";
        projectNext.style.opacity = atEnd ? "0.35" : "1";

        projectPrev.style.pointerEvents = atStart ? "none" : "auto";
        projectNext.style.pointerEvents = atEnd ? "none" : "auto";

        projectPrev.style.cursor = atStart ? "default" : "pointer";
        projectNext.style.cursor = atEnd ? "default" : "pointer";
    }


    function setupProjectCarousel() {

        if (!projectGrid || !projectCards.length) {
            return;
        }

        if (
            projectGrid.parentElement &&
            projectGrid.parentElement.classList.contains(
                "project-carousel-viewport"
            )
        ) {
            projectViewport = projectGrid.parentElement;

        } else {

            projectViewport = document.createElement("div");

            projectViewport.className =
                "project-carousel-viewport";

            projectViewport.style.width = "100%";
            projectViewport.style.overflow = "hidden";
            projectViewport.style.position = "relative";

            projectGrid.parentNode.insertBefore(
                projectViewport,
                projectGrid
            );

            projectViewport.appendChild(projectGrid);
        }

        projectGrid.style.display = "flex";
        projectGrid.style.flexWrap = "nowrap";
        projectGrid.style.gap = "15px";
        projectGrid.style.width = "100%";
        projectGrid.style.marginTop = "8px";
        projectGrid.style.transition =
            "transform .45s ease";
        projectGrid.style.willChange = "transform";
    }


    function resizeProjectCards() {

        if (
            !projectViewport ||
            !projectGrid ||
            !projectCards.length
        ) {
            return;
        }

        const visible = getVisibleProjectCards();
        const gap = 15;
        const viewportWidth =
            projectViewport.clientWidth;

        if (!viewportWidth) {
            return;
        }

        const cardWidth =
            (viewportWidth - gap * (visible - 1)) / visible;

        projectCards.forEach((card) => {

            card.style.flex =
                `0 0 ${cardWidth}px}`;

            card.style.width =
                `${cardWidth}px`;

            card.style.minWidth =
                `${cardWidth}px`;

            card.style.boxSizing =
                "border-box";
        });

        const max = getProjectMaxIndex();

        if (projectIndex > max) {
            projectIndex = max;
        }

        updateProjectPosition(false);
    }


    function updateProjectPosition(animate = true) {

        if (
            !projectGrid ||
            !projectCards.length
        ) {
            return;
        }

        const firstCard = projectCards[0];

        const cardWidth =
            firstCard.getBoundingClientRect().width;

        const gap = 15;

        const distance =
            (cardWidth + gap) * projectIndex;

        projectGrid.style.transition =
            animate
                ? "transform .45s ease"
                : "none";

        projectGrid.style.transform =
            `translate3d(-${distance}px,0,0)`;

        updateProjectButtons();
    }


    function moveProject(direction) {

        if (!projectCards.length) {
            return;
        }

        const max =
            getProjectMaxIndex();

        const nextIndex =
            Math.max(
                0,
                Math.min(
                    projectIndex + direction,
                    max
                )
            );

        if (nextIndex === projectIndex) {
            updateProjectButtons();
            return;
        }

        projectIndex =
            nextIndex;

        updateProjectPosition(true);
    }


    if (projectPrev) {

        projectPrev.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();

                moveProject(-1);
            }
        );
    }


    if (projectNext) {

        projectNext.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();

                moveProject(1);
            }
        );
    }


    if (
        projectGrid &&
        projectCards.length
    ) {

        setupProjectCarousel();

        requestAnimationFrame(() => {
            resizeProjectCards();
        });
    }


    /* =====================================================
       EXPERIENCIA PROFESIONAL
       ===================================================== */

    const experienceTrack =
        document.getElementById(
            "experienceTrack"
        );

    const experienceItems =
        Array.from(
            document.querySelectorAll(
                ".experience-item"
            )
        );

    const experiencePrev =
        document.getElementById(
            "experiencePrev"
        );

    const experienceNext =
        document.getElementById(
            "experienceNext"
        );

    const experienceCounter =
        document.getElementById(
            "experienceCounter"
        );

    const experienceProgressBar =
        document.getElementById(
            "experienceProgressBar"
        );

    let experienceIndex = 0;
    let experienceTimer = null;


    function getVisibleExperiences() {

        const width =
            window.innerWidth;

        if (width <= 600) {
            return 1;
        }

        if (width <= 1000) {
            return 2;
        }

        return 3;
    }


    function getMaxExperienceIndex() {

        return Math.max(
            0,
            experienceItems.length -
            getVisibleExperiences()
        );
    }


    function updateExperienceButtons() {

        if (
            !experiencePrev ||
            !experienceNext
        ) {
            return;
        }

        const max =
            getMaxExperienceIndex();

        const atStart =
            experienceIndex <= 0;

        const atEnd =
            experienceIndex >= max;

        experiencePrev.disabled =
            atStart;

        experienceNext.disabled =
            atEnd;

        experiencePrev.style.opacity =
            atStart ? "0.35" : "1";

        experienceNext.style.opacity =
            atEnd ? "0.35" : "1";

        experiencePrev.style.pointerEvents =
            atStart ? "none" : "auto";

        experienceNext.style.pointerEvents =
            atEnd ? "none" : "auto";
    }


    function updateExperienceIndicator() {

        if (
            !experienceCounter ||
            !experienceItems.length
        ) {
            return;
        }

        const total =
            experienceItems.length;

        const current =
            Math.min(
                experienceIndex + 1,
                total
            );

        experienceCounter.textContent =
            `${current} / ${total}`;

        if (experienceProgressBar) {

            const max =
                Math.max(
                    1,
                    getMaxExperienceIndex()
                );

            const percentage =
                ((experienceIndex + 1) /
                    (max + 1)) *
                100;

            experienceProgressBar.style.width =
                `${Math.min(
                    100,
                    Math.max(
                        12.5,
                        percentage
                    )
                )}%`;
        }
    }


    function updateExperienceCarousel() {

        if (
            !experienceTrack ||
            !experienceItems.length
        ) {
            return;
        }

        const visible =
            getVisibleExperiences();

        const carousel =
            document.querySelector(
                ".experience-carousel"
            );

        if (!carousel) {
            return;
        }

        const gap = 18;

        const width =
            carousel.clientWidth;

        if (!width) {
            return;
        }

        const cardWidth =
            (width -
                gap * (visible - 1)) /
            visible;

        experienceItems.forEach(
            (item) => {

                item.style.flex =
                    `0 0 ${cardWidth}px`;

                item.style.width =
                    `${cardWidth}px`;

                item.style.minWidth =
                    `${cardWidth}px`;

                item.style.boxSizing =
                    "border-box";
            }
        );

        const max =
            getMaxExperienceIndex();

        if (experienceIndex > max) {
            experienceIndex = max;
        }

        const distance =
            (cardWidth + gap) *
            experienceIndex;

        experienceTrack.style.transform =
            `translate3d(-${distance}px,0,0)`;

        updateExperienceButtons();
        updateExperienceIndicator();
    }


    function startExperienceAutoplay() {

        stopExperienceAutoplay();

        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {
            return;
        }

        experienceTimer =
            setInterval(() => {

                const max =
                    getMaxExperienceIndex();

                if (max <= 0) {
                    return;
                }

                if (
                    experienceIndex >= max
                ) {
                    experienceIndex = 0;

                } else {
                    experienceIndex++;
                }

                updateExperienceCarousel();

            }, 5000);
    }


    function stopExperienceAutoplay() {

        if (experienceTimer) {

            clearInterval(
                experienceTimer
            );

            experienceTimer = null;
        }
    }


    if (experienceNext) {

        experienceNext.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();

                const max =
                    getMaxExperienceIndex();

                if (
                    experienceIndex < max
                ) {

                    experienceIndex++;

                    updateExperienceCarousel();
                }
            }
        );
    }


    if (experiencePrev) {

        experiencePrev.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();

                if (
                    experienceIndex > 0
                ) {

                    experienceIndex--;

                    updateExperienceCarousel();
                }
            }
        );
    }


    const experienceCarousel =
        document.querySelector(
            ".experience-carousel"
        );

    if (experienceCarousel) {

        experienceCarousel.addEventListener(
            "mouseenter",
            stopExperienceAutoplay
        );

        experienceCarousel.addEventListener(
            "mouseleave",
            startExperienceAutoplay
        );
    }


    if (
        experienceTrack &&
        experienceItems.length
    ) {

        requestAnimationFrame(() => {

            updateExperienceCarousel();

            startExperienceAutoplay();
        });
    }


    /* =====================================================
       FORMULARIO DE CONTACTO
       ===================================================== */

    const contactButtons =
        document.querySelectorAll(
            "#openContactForm"
        );


    contactButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();

                    createContactForm();
                }
            );
        }
    );


    document
        .querySelectorAll(
            '[data-open-contact="true"]'
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();
                        event.stopPropagation();

                        createContactForm();
                    }
                );
            }
        );


    function createContactForm() {

        const existing =
            document.getElementById(
                "contactFormOverlay"
            );

        if (existing) {

            existing.classList.add(
                "active"
            );

            document.body.style.overflow =
                "hidden";

            return;
        }


        const overlay =
            document.createElement("div");

        overlay.id =
            "contactFormOverlay";

        overlay.innerHTML = `

            <div
                class="contact-form-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="contactFormTitle"
            >

                <div class="contact-form-header">

                    <div>

                        <span>
                            CONTACTO PROFESIONAL
                        </span>

                        <h3 id="contactFormTitle">
                            Solicitar contacto
                        </h3>

                    </div>

                    <button
                        type="button"
                        id="closeContactForm"
                        class="contact-form-close"
                        aria-label="Cerrar"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>

                </div>


                <form
                    id="professionalContactForm"
                    class="professional-contact-form"
                >

                    <!-- CONFIGURACIÓN FORMSUBMIT -->

                    <input
                        type="hidden"
                        name="_subject"
                        value="Nueva solicitud de contacto - Marrugo Ingeniería"
                    >

                    <input
                        type="hidden"
                        name="_template"
                        value="table"
                    >

                    <input
                        type="hidden"
                        name="_captcha"
                        value="true"
                    >

                    <input
                        type="text"
                        name="_honey"
                        tabindex="-1"
                        autocomplete="off"
                        style="display:none"
                    >


                    <div class="form-group">

                        <label for="visitorName">
                            Nombre completo
                        </label>

                        <input
                            type="text"
                            id="visitorName"
                            name="nombre"
                            placeholder="Ingrese su nombre completo"
                            minlength="3"
                            maxlength="80"
                            autocomplete="name"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label for="visitorCompany">
                            Empresa
                        </label>

                        <input
                            type="text"
                            id="visitorCompany"
                            name="empresa"
                            placeholder="Nombre de su empresa"
                            maxlength="100"
                            autocomplete="organization"
                        >

                    </div>


                    <div class="form-group">

                        <label for="visitorEmail">
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            id="visitorEmail"
                            name="email"
                            placeholder="correo@empresa.com"
                            maxlength="120"
                            autocomplete="email"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label for="visitorPhone">
                            Teléfono
                        </label>

                        <input
                            type="tel"
                            id="visitorPhone"
                            name="telefono"
                            placeholder="+57 300 000 0000"
                            maxlength="20"
                            autocomplete="tel"
                            inputmode="tel"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label for="contactReason">
                            Motivo del contacto
                        </label>

                        <select
                            id="contactReason"
                            name="motivo"
                            required
                        >

                            <option value="">
                                Seleccione una opción
                            </option>

                            <option value="Proyecto de construcción">
                                Proyecto de construcción
                            </option>

                            <option value="Interventoría">
                                Interventoría
                            </option>

                            <option value="Supervisión">
                                Supervisión
                            </option>

                            <option value="Consultoría">
                                Consultoría
                            </option>

                            <option value="Alianza profesional">
                                Alianza profesional
                            </option>

                            <option value="Contratación">
                                Contratación
                            </option>

                            <option value="Otro">
                                Otro
                            </option>

                        </select>

                    </div>


                    <div class="form-group">

                        <label for="visitorMessage">
                            Mensaje
                        </label>

                        <textarea
                            id="visitorMessage"
                            name="mensaje"
                            rows="5"
                            minlength="10"
                            maxlength="1000"
                            placeholder="Cuéntenos brevemente sobre su proyecto o solicitud..."
                            required
                        ></textarea>

                    </div>


                    <div class="contact-form-note">

                        <i class="fa-solid fa-shield-halved"></i>

                        <span>
                            Sus datos se utilizarán únicamente
                            para responder esta solicitud profesional.
                        </span>

                    </div>


                    <div class="contact-form-actions">

                        <button
                            type="button"
                            id="cancelContactForm"
                            class="contact-form-cancel"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            id="sendContactForm"
                            class="contact-form-submit"
                        >
                            Enviar solicitud
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>

                    </div>

                </form>

            </div>
        `;


        document.body.appendChild(
            overlay
        );


        requestAnimationFrame(() => {

            overlay.classList.add(
                "active"
            );
        });


        document.body.style.overflow =
            "hidden";


        const form =
            document.getElementById(
                "professionalContactForm"
            );

        const closeButton =
            document.getElementById(
                "closeContactForm"
            );

        const cancelButton =
            document.getElementById(
                "cancelContactForm"
            );

        const sendButton =
            document.getElementById(
                "sendContactForm"
            );

        const nameInput =
            document.getElementById(
                "visitorName"
            );

        const emailInput =
            document.getElementById(
                "visitorEmail"
            );

        const phoneInput =
            document.getElementById(
                "visitorPhone"
            );


        /* =================================================
           CERRAR MODAL
           ================================================== */

        let closing = false;


        function closeModal() {

            if (closing) {
                return;
            }

            closing = true;

            overlay.classList.remove(
                "active"
            );

            document.body.style.overflow =
                "";

            document.removeEventListener(
                "keydown",
                handleEscape
            );

            setTimeout(() => {

                if (
                    overlay.parentNode
                ) {
                    overlay.remove();
                }

            }, 300);
        }


        closeButton.addEventListener(
            "click",
            closeModal
        );

        cancelButton.addEventListener(
            "click",
            closeModal
        );


        overlay.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === overlay
                ) {
                    closeModal();
                }
            }
        );


        /* =================================================
           ESCAPE
           ================================================== */

        function handleEscape(event) {

            if (
                event.key === "Escape"
            ) {
                closeModal();
            }
        }


        document.addEventListener(
            "keydown",
            handleEscape
        );


        /* =================================================
           FOCUS
           ================================================== */

        setTimeout(() => {

            if (nameInput) {
                nameInput.focus();
            }

        }, 150);


        /* =================================================
           TELÉFONO
           ================================================== */

        phoneInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(
                        /[^0-9+\s()\-]/g,
                        ""
                    );
            }
        );


        function validatePhone(value) {

            const clean =
                value.replace(
                    /[\s()+\-]/g,
                    ""
                );

            return /^\d{7,15}$/.test(
                clean
            );
        }


        /* =================================================
           ENVÍO FORMSUBMIT AJAX
           ================================================== */

        form.addEventListener(
            "submit",
            async (event) => {

                /*
                 * MUY IMPORTANTE:
                 * Evita que el navegador abandone
                 * la página y vaya a FormSubmit.
                 */

                event.preventDefault();
                event.stopPropagation();


                if (
                    !form.checkValidity()
                ) {

                    form.reportValidity();

                    return;
                }


                const correo =
                    emailInput.value.trim();

                const telefono =
                    phoneInput.value.trim();


                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailRegex.test(correo)
                ) {

                    alert(
                        "Ingrese un correo electrónico válido."
                    );

                    emailInput.focus();

                    return;
                }


                if (
                    !validatePhone(
                        telefono
                    )
                ) {

                    alert(
                        "Ingrese un número de teléfono válido."
                    );

                    phoneInput.focus();

                    return;
                }


                sendButton.disabled =
                    true;


                sendButton.innerHTML = `
                    Enviando...
                    <i class="fa-solid fa-spinner fa-spin"></i>
                `;


                try {

                    const data =
                        new FormData(form);


                    /*
                     * Correo del visitante.
                     * FormSubmit lo utilizará como
                     * correo de respuesta.
                     */

                    let replyTo =
                        form.querySelector(
                            'input[name="_replyto"]'
                        );


                    if (!replyTo) {

                        replyTo =
                            document.createElement(
                                "input"
                            );

                        replyTo.type =
                            "hidden";

                        replyTo.name =
                            "_replyto";

                        form.appendChild(
                            replyTo
                        );
                    }


                    replyTo.value =
                        correo;


                    data.set(
                        "_replyto",
                        correo
                    );


                    /*
                     * ENVÍO AJAX A FORMSUBMIT
                     */

                    const response =
                        await fetch(
                            FORMSUBMIT_ENDPOINT,
                            {
                                method: "POST",

                                headers: {
                                    "Accept":
                                        "application/json"
                                },

                                body: data
                            }
                        );


                    let result = {};


                    try {

                        result =
                            await response.json();

                    } catch (jsonError) {

                        result = {};
                    }


                    if (
                        !response.ok ||
                        result.success === false ||
                        result.error
                    ) {

                        throw new Error(
                            result.message ||
                            "No fue posible enviar el formulario."
                        );
                    }


                    /*
                     * MENSAJE PERSONALIZADO
                     * DESPUÉS DEL ENVÍO
                     */

                    const modal =
                        document.querySelector(
                            ".contact-form-modal"
                        );


                    if (modal) {

                        modal.innerHTML = `

                            <div class="contact-form-header">

                                <div>

                                    <span>
                                        CONTACTO PROFESIONAL
                                    </span>

                                    <h3>
                                        Solicitud recibida
                                    </h3>

                                </div>


                                <button
                                    type="button"
                                    id="successCloseButton"
                                    class="contact-form-close"
                                    aria-label="Cerrar"
                                >
                                    <i class="fa-solid fa-xmark"></i>
                                </button>

                            </div>


                            <div
                                style="
                                    padding: 40px 28px;
                                    text-align: center;
                                "
                            >

                                <div
                                    style="
                                        font-size: 52px;
                                        margin-bottom: 18px;
                                    "
                                >
                                    <i
                                        class="fa-solid fa-circle-check"
                                    ></i>
                                </div>


                                <h3
                                    style="
                                        margin-bottom: 12px;
                                    "
                                >
                                    ¡Mensaje enviado correctamente!
                                </h3>


                                <p
                                    style="
                                        line-height: 1.7;
                                        margin: 0 auto;
                                        max-width: 520px;
                                    "
                                >
                                    Hemos recibido su solicitud.
                                    Nos comunicaremos con usted
                                    lo más pronto posible.
                                </p>


                                <button
                                    type="button"
                                    id="successContinueButton"
                                    class="contact-form-submit"
                                    style="margin-top: 25px;"
                                >
                                    Continuar

                                    <i
                                        class="fa-solid fa-arrow-right"
                                    ></i>

                                </button>

                            </div>
                        `;


                        const closeSuccess =
                            () => {

                                if (
                                    typeof closeModal ===
                                    "function"
                                ) {

                                    closeModal();
                                }
                            };


                        const successCloseButton =
                            document.getElementById(
                                "successCloseButton"
                            );

                        const successContinueButton =
                            document.getElementById(
                                "successContinueButton"
                            );


                        if (
                            successCloseButton
                        ) {

                            successCloseButton.addEventListener(
                                "click",
                                closeSuccess
                            );
                        }


                        if (
                            successContinueButton
                        ) {

                            successContinueButton.addEventListener(
                                "click",
                                closeSuccess
                            );
                        }


                        /*
                         * Cierra automáticamente
                         * después de 5 segundos.
                         */

                        setTimeout(
                            closeSuccess,
                            5000
                        );
                    }

                } catch (error) {

                    console.error(
                        "Error al enviar formulario:",
                        error
                    );


                    alert(
                        "No fue posible enviar el mensaje en este momento. Por favor, inténtelo nuevamente."
                    );


                    sendButton.disabled =
                        false;


                    sendButton.innerHTML = `
                        Enviar solicitud
                        <i class="fa-solid fa-paper-plane"></i>
                    `;
                }

            }
        );
    }


    /* =====================================================
       EVITAR ENLACES # VACÍOS
       ===================================================== */

    document
        .querySelectorAll(
            'a[href="#"]'
        )
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();
                    }
                );
            }
        );


    /* =====================================================
       INICIO
       ===================================================== */

    activateMenuOnScroll();


    console.log(
        "Marrugo Ingeniería: script.js cargado con FormSubmit correctamente."
    );

});