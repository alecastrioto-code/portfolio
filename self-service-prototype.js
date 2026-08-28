/* =========================================================
   VISTA ASSISTANT — LATE ORDER PROTOTYPE
   ========================================================= */

(() => {

  const root =
    document.querySelector(
      ".ss-va-prototype"
    );


  if (!root) {
    return;
  }


  const stream =
    root.querySelector(
      ".va-chat-stream"
    );


  const actionArea =
    root.querySelector(
      ".va-action-area"
    );


  const resetButton =
    root.querySelector(
      ".va-reset"
    );


  const decisionRule =
    root.querySelector(
      ".va-decision-rule"
    );


  const decisionOutput =
    root.querySelector(
      ".va-decision-output"
    );


  if (
    !stream ||
    !actionArea ||
    !resetButton
  ) {
    return;
  }


  /* =======================================================
     INITIAL STATE
     ======================================================= */

  const initialStreamHTML =
    stream.innerHTML;


  const avatarSrc =
    "../assets/self-service/sender-avatar.svg";


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;



  /* =======================================================
     FLOW STATE
     ======================================================= */

  const state = {

    phase:
      "select-order",

    order:
      null,

    product:
      null,

    resolution:
      null

  };



  /* =======================================================
     CONTEXT DEFAULTS
     ======================================================= */

  const contextDefaults = {

    customer: [
      true,
      "Authenticated"
    ],

    order: [
      false,
      "Not selected yet"
    ],

    product: [
      false,
      "Not selected yet"
    ],

    tracking: [
      false,
      "Waiting for product"
    ],

    edd: [
      false,
      "Waiting for product"
    ],

    intent: [
      true,
      "Late order"
    ],

    policy: [
      false,
      "Not evaluated yet"
    ]

  };



  /* =======================================================
     SCROLL
     ======================================================= */

  function scrollToLatest() {

    window.requestAnimationFrame(
      () => {

        stream.scrollTo({

          top:
            stream.scrollHeight,

          behavior:
            reducedMotion
              ? "auto"
              : "smooth"

        });

      }
    );

  }



  /* =======================================================
     CONTEXT PANEL
     ======================================================= */

  function setContext(
    key,
    complete,
    detail
  ) {

    const item =
      root.querySelector(
        `[data-context="${key}"]`
      );


    if (!item) {
      return;
    }


    item.classList.toggle(
      "is-complete",
      complete
    );


    const small =
      item.querySelector(
        "small"
      );


    if (
      small &&
      detail
    ) {

      small.textContent =
        detail;

    }

  }



  function resetContext() {

    Object.entries(
      contextDefaults
    ).forEach(
      ([key, value]) => {

        setContext(
          key,
          value[0],
          value[1]
        );

      }
    );

  }



  function setDecision(
    rule,
    output
  ) {

    if (decisionRule) {

      decisionRule.textContent =
        rule;

    }


    if (decisionOutput) {

      decisionOutput.textContent =
        output;

    }

  }



  /* =======================================================
     ACTION AREA
     ======================================================= */

  function clearActions() {

    actionArea.innerHTML =
      "";


    actionArea.classList.remove(
      "is-stacked"
    );

  }



  function showActions(
    choices,
    layout = "default"
  ) {

    clearActions();


    if (
      layout === "stacked"
    ) {

      actionArea.classList.add(
        "is-stacked"
      );

    }


    choices.forEach(
      choice => {

        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.className =
          "va-option";


        button.textContent =
          choice.label;


        if (
          choice.primary
        ) {

          button.classList.add(
            "is-primary"
          );

        }


        button.addEventListener(
          "click",
          choice.action
        );


        actionArea.appendChild(
          button
        );

      }
    );

  }



  /* =======================================================
     CUSTOMER MESSAGE
     ======================================================= */

  function addUserMessage(
    text
  ) {

    const wrapper =
      document.createElement(
        "div"
      );


    wrapper.className =
      "va-message va-message-user";


    const bubble =
      document.createElement(
        "div"
      );


    bubble.className =
      "va-customer-bubble";


    const message =
      document.createElement(
        "p"
      );


    message.textContent =
      text;


    const time =
      document.createElement(
        "span"
      );


    time.textContent =
      "11:07";


    bubble.append(
      message,
      time
    );


    wrapper.appendChild(
      bubble
    );


    stream.appendChild(
      wrapper
    );


    scrollToLatest();

  }



  /* =======================================================
     ASSISTANT TURN

     One assistant turn can contain several orange bubbles.
     Only one avatar is shown.
     Metadata appears on the final bubble.
     ======================================================= */

  function addAssistantTurn(
    messages
  ) {

    const wrapper =
      document.createElement(
        "div"
      );


    wrapper.className =
      "va-message va-message-assistant";


    const avatar =
      document.createElement(
        "img"
      );


    avatar.className =
      "va-sender-avatar";


    avatar.src =
      avatarSrc;


    avatar.alt =
      "";


    avatar.setAttribute(
      "aria-hidden",
      "true"
    );


    const stack =
      document.createElement(
        "div"
      );


    stack.className =
      "va-assistant-stack";


    messages.forEach(
      (item, index) => {

        const bubble =
          document.createElement(
            "div"
          );


        bubble.className =
          "va-assistant-bubble";


        const message =
          document.createElement(
            "p"
          );


        if (
          item.html
        ) {

          message.innerHTML =
            item.html;

        }

        else {

          message.textContent =
            item.text;

        }


        bubble.appendChild(
          message
        );


        if (
          index ===
          messages.length - 1
        ) {

          const meta =
            document.createElement(
              "div"
            );


          meta.className =
            "va-message-meta";


          meta.textContent =
            "Vista Assistant · 11:09";


          bubble.appendChild(
            meta
          );

        }


        stack.appendChild(
          bubble
        );

      }
    );


    wrapper.append(
      avatar,
      stack
    );


    stream.appendChild(
      wrapper
    );


    scrollToLatest();

  }



  function addAssistantMessage(
    text
  ) {

    addAssistantTurn([

      {
        text
      }

    ]);

  }



  function addAssistantHTML(
    html
  ) {

    addAssistantTurn([

      {
        html
      }

    ]);

  }



  /* =======================================================
     PRODUCT SELECTION
     ======================================================= */

  function renderProducts() {

    const list =
      document.createElement(
        "div"
      );


    list.className =
      "va-product-list";


    const products = [

      {
        id:
          "business-cards",

        name:
          "Business Cards",

        price:
          "$23.34",

        image:
          "../assets/self-service/bc.png"
      },


      {
        id:
          "flyers",

        name:
          "Flyers",

        price:
          "$27.17",

        image:
          "../assets/self-service/flyers.png"
      }

    ];


    products.forEach(
      product => {

        const card =
          document.createElement(
            "button"
          );


        card.type =
          "button";


        card.className =
          "va-product-card";


        card.dataset.product =
          product.id;


        const imageWrapper =
          document.createElement(
            "div"
          );


        imageWrapper.className =
          "va-product-image";


        const image =
          document.createElement(
            "img"
          );


        image.src =
          product.image;


        image.alt =
          "";


        imageWrapper.appendChild(
          image
        );


        const info =
          document.createElement(
            "div"
          );


        info.className =
          "va-product-info";


        const title =
          document.createElement(
            "strong"
          );


        title.textContent =
          product.name;


        const price =
          document.createElement(
            "span"
          );


        price.textContent =
          product.price;


        info.append(
          title,
          price
        );


        card.append(
          imageWrapper,
          info
        );


        list.appendChild(
          card
        );

      }
    );


    stream.appendChild(
      list
    );


    scrollToLatest();

  }



  /* =======================================================
     RESOLUTION SELECTION
     ======================================================= */

  function renderResolutionChoices() {

    const list =
      document.createElement(
        "div"
      );


    list.className =
      "va-resolution-list";


    const choices = [

      {
        id:
          "store-credit",

        title:
          "Vista store credit",

        detail:
          "Appears in your account within 30 minutes."
      },


      {
        id:
          "refund",

        title:
          "Refund",

        detail:
          "Back in your bank account in 3–5 business days."
      },


      {
        id:
          "support",

        title:
          "Chat with Customer Support",

        detail:
          "Continue with a specialist."
      }

    ];


    choices.forEach(
      choice => {

        const card =
          document.createElement(
            "button"
          );


        card.type =
          "button";


        card.className =
          "va-resolution-card";


        card.dataset.resolution =
          choice.id;


        const title =
          document.createElement(
            "strong"
          );


        title.textContent =
          choice.title;


        const detail =
          document.createElement(
            "span"
          );


        detail.textContent =
          choice.detail;


        card.append(
          title,
          detail
        );


        list.appendChild(
          card
        );

      }
    );


    stream.appendChild(
      list
    );


    scrollToLatest();

  }



  /* =======================================================
     ORDER SELECTION
     ======================================================= */

  function chooseOrder(
    orderId
  ) {

    if (
      state.phase !==
      "select-order"
    ) {
      return;
    }


    state.order =
      orderId;


    setContext(
      "order",
      true,
      orderId
    );


    addUserMessage(
      `Order ${orderId}`
    );



    /* -------------------------------------------------------
       ALTERNATE ORDER
       ------------------------------------------------------- */

    if (
      orderId ===
      "VP_102932"
    ) {

      state.phase =
        "order-not-late";


      setContext(
        "tracking",
        true,
        "Delivered"
      );


      setContext(
        "edd",
        true,
        "Delivery complete"
      );


      setDecision(
        "Status = delivered",
        "Not a late-order case"
      );


      addAssistantMessage(
        "That order is already marked as delivered, so it doesn't follow the late-order path. If something is missing from it, that would use a different resolution flow."
      );


      showActions([

        {
          label:
            "Choose another order",

          primary:
            true,

          action:
            startFlow
        }

      ]);


      return;

    }



    /* -------------------------------------------------------
       MAIN WORKED EXAMPLE
       ------------------------------------------------------- */

    state.phase =
      "select-product";


    addAssistantMessage(
      "Okay, which product?"
    );


    renderProducts();

  }



  /* =======================================================
     PRODUCT PICK
     ======================================================= */

  function selectProduct(
    productId,
    card
  ) {

    if (
      state.phase !==
      "select-product"
    ) {
      return;
    }


    state.product =
      productId;


    stream
      .querySelectorAll(
        ".va-product-card"
      )
      .forEach(
        item => {

          item.classList.toggle(
            "is-selected",
            item === card
          );

        }
      );


    const productName =
      productId ===
      "flyers"

        ? "Flyers"

        : "Business Cards";


    setContext(
      "product",
      true,
      productName
    );


    showActions([

      {
        label:
          "Confirm selection",

        primary:
          true,

        action:
          confirmProduct
      }

    ]);

  }



  function confirmProduct() {

    if (
      state.phase !==
        "select-product" ||
      !state.product
    ) {
      return;
    }


    clearActions();


    state.phase =
      "evaluating-product";


    if (
      state.product ===
      "business-cards"
    ) {

      runOnTimeBranch();

      return;

    }


    runLateBranch();

  }



  /* =======================================================
     BUSINESS CARDS — ON TIME
     ======================================================= */

  function runOnTimeBranch() {

    addUserMessage(
      "Business Cards"
    );


    setContext(
      "tracking",
      true,
      "In transit"
    );


    setContext(
      "edd",
      true,
      "27 Mar 2025"
    );


    setDecision(
      "EDD ≥ today + in transit",
      "On-time guidance"
    );


    addAssistantTurn([

      {
        text:
          "Your Business Cards seem to be on time."
      },


      {
        html:
          "They are in transit. Estimated delivery date is <strong>Thursday, March 27th.</strong>"
      },


      {
        text:
          "Can I help you with anything else?"
      }

    ]);


    state.phase =
      "on-time-result";


    /*
     * Both options use secondary skin.
     * They are vertically stacked and aligned
     * with the assistant bubble.
     */

    showActions(
      [

        {
          label:
            "That works for me",

          action:
            finishOnTime
        },


        {
          label:
            "That doesn't work for me",

          action() {

            addUserMessage(
              "That doesn't work for me"
            );


            specialistHandoff();

          }
        }

      ],

      "stacked"
    );

  }



  function finishOnTime() {

    if (
      state.phase !==
      "on-time-result"
    ) {
      return;
    }


    clearActions();


    addUserMessage(
      "That works for me"
    );


    setDecision(
      "No remediation required",
      "Resolved — guidance"
    );


    addAssistantMessage(
      "Great. You can keep tracking the order from your order status page."
    );


    state.phase =
      "complete";


    showActions([

      {
        label:
          "Restart scenario",

        action:
          startFlow
      }

    ]);

  }



  /* =======================================================
     FLYERS — LATE
     ======================================================= */

  function runLateBranch() {

    addUserMessage(
      "Flyers"
    );


    setContext(
      "tracking",
      true,
      "Not delivered"
    );


    setContext(
      "edd",
      true,
      "Expected date passed"
    );


    setContext(
      "policy",
      true,
      "Shipping compensation eligible"
    );


    setDecision(
      "EDD < today + not delivered",
      "Late — compensation eligible"
    );


    addAssistantTurn([

      {
        html:
          "We're sorry for the delay with your order. Your <strong>Flyers</strong> are now expected to arrive by <strong>Thursday, March 27th.</strong>"
      },


      {
        html:
          "To make up for the delay, we'd like to offer a <strong>reimbursement of the shipping fee.</strong>"
      },


      {
        text:
          "How would you like to receive it?"
      }

    ]);


    state.phase =
      "select-resolution";


    renderResolutionChoices();

  }



  /* =======================================================
     RESOLUTION PICK
     ======================================================= */

  function selectResolution(
    resolutionId
  ) {

    if (
      state.phase !==
      "select-resolution"
    ) {
      return;
    }


    state.resolution =
      resolutionId;



    /* -------------------------------------------------------
       HUMAN SUPPORT
       ------------------------------------------------------- */

    if (
      resolutionId ===
      "support"
    ) {

      addUserMessage(
        "Chat with Customer Support"
      );


      specialistHandoff();

      return;

    }



    const isRefund =
      resolutionId ===
      "refund";


    const label =
      isRefund

        ? "Refund"

        : "Vista store credit";


    addUserMessage(
      label
    );


    setDecision(
      "Compensation method selected",
      "Awaiting confirmation"
    );


    addAssistantTurn([

      {
        html:
          `Here's what you will receive:<br><br><strong>Shipping fee $5.99</strong><br><strong>Preferred resolution: ${label}</strong>`
      },


      {
        text:
          "Do you want to continue with the request?"
      }

    ]);


    state.phase =
      "confirm-resolution";


    showActions([

      {
        label:
          "No, thank you",

        action:
          cancelResolution
      },


      {
        label:
          "Yes",

        action:
          confirmResolution
      }

    ]);

  }



  /* =======================================================
     DECLINE RESOLUTION
     ======================================================= */

  function cancelResolution() {

    if (
      state.phase !==
      "confirm-resolution"
    ) {
      return;
    }


    clearActions();


    addUserMessage(
      "No, thank you"
    );


    setDecision(
      "Customer declined remediation",
      "No action taken"
    );


    addAssistantMessage(
      "No problem. I haven't made any changes to your order."
    );


    state.phase =
      "complete";


    showActions([

      {
        label:
          "Restart scenario",

        action:
          startFlow
      }

    ]);

  }



  /* =======================================================
     CONFIRM AUTOMATED RESOLUTION
     ======================================================= */

  function confirmResolution() {

    if (
      state.phase !==
      "confirm-resolution"
    ) {
      return;
    }


    clearActions();


    addUserMessage(
      "Yes"
    );



    if (
      state.resolution ===
      "refund"
    ) {

      setDecision(
        "Eligible action + customer confirmation",
        "Automated refund"
      );


      addAssistantTurn([

        {
          html:
            "All set! Your <strong>Refund</strong> is on its way for the total amount of <strong>$5.99</strong>."
        },


        {
          text:
            "If your order hasn't arrived in 2 days, come back here for support."
        },


        {
          text:
            "Is there anything else I can help you with?"
        }

      ]);

    }

    else {

      setDecision(
        "Eligible action + customer confirmation",
        "Vista store credit issued"
      );


      addAssistantTurn([

        {
          html:
            "All set! Your <strong>Vista store credit</strong> has been issued for <strong>$5.99</strong>."
        },


        {
          text:
            "If your order hasn't arrived in 2 days, come back here for support."
        },


        {
          text:
            "Is there anything else I can help you with?"
        }

      ]);

    }


    state.phase =
      "complete";


    showActions([

      {
        label:
          "Restart scenario",

        action:
          startFlow
      }

    ]);

  }



  /* =======================================================
     SPECIALIST HANDOFF
     ======================================================= */

  function specialistHandoff() {

    clearActions();


    setContext(
      "policy",
      true,
      "Specialist route available"
    );


    setDecision(
      "Automation no longer preferred",
      "Human specialist"
    );


    addAssistantTurn([

      {
        text:
          "I'll connect you with a specialist to review your case and help resolve it."
      },


      {
        text:
          "I'll share the context collected here so you won't need to repeat yourself."
      }

    ]);


    state.phase =
      "complete";


    showActions([

      {
        label:
          "Restart scenario",

        action:
          startFlow
      }

    ]);

  }



  /* =======================================================
     RESET
     ======================================================= */

  function startFlow() {

    state.phase =
      "select-order";


    state.order =
      null;


    state.product =
      null;


    state.resolution =
      null;


    stream.innerHTML =
      initialStreamHTML;


    clearActions();


    resetContext();


    setDecision(
      "Waiting for order + product context",
      "Gathering context…"
    );


    stream.scrollTop =
      0;

  }



  /* =======================================================
     EVENT DELEGATION
     ======================================================= */

  stream.addEventListener(
    "click",
    event => {


      const orderCard =
        event.target.closest(
          ".va-order-card"
        );


      if (
        orderCard &&
        stream.contains(orderCard)
      ) {

        chooseOrder(
          orderCard.dataset.order
        );

        return;

      }



      const productCard =
        event.target.closest(
          ".va-product-card"
        );


      if (
        productCard &&
        stream.contains(productCard)
      ) {

        selectProduct(
          productCard.dataset.product,
          productCard
        );

        return;

      }



      const resolutionCard =
        event.target.closest(
          ".va-resolution-card"
        );


      if (
        resolutionCard &&
        stream.contains(resolutionCard)
      ) {

        selectResolution(
          resolutionCard.dataset.resolution
        );

      }

    }
  );



  /* =======================================================
     INIT
     ======================================================= */

  resetButton.addEventListener(
    "click",
    startFlow
  );


  startFlow();

})();