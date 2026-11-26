/* Hydrates legal provider & support contact fields at runtime so static HTML
   and public repository source contain zero plain-text scrapeable addresses or emails,
   while keeping § 5 DDG & GDPR Art. 13 information immediately visible in any browser. */
(() => {
  const decode = (codes) => String.fromCharCode(...codes);

  const name = decode([82, 97, 108, 102, 32, 66, 101, 101, 115, 107, 111, 119]);
  const careOf = decode([99, 47, 111, 32, 73, 80, 45, 77, 97, 110, 97, 103, 101, 109, 101, 110, 116, 32, 35, 55, 56, 50, 49]);
  const street = decode([76, 117, 100, 119, 105, 103, 45, 69, 114, 104, 97, 114, 100, 45, 83, 116, 114, 46, 32, 49, 56]);
  const city = decode([50, 48, 52, 53, 57, 32, 72, 97, 109, 98, 117, 114, 103]);
  const country = decode([68, 101, 117, 116, 115, 99, 104, 108, 97, 110, 100]);
  const mail = decode([114, 97, 108, 102, 46, 98, 101, 101, 115, 107, 111, 119, 64, 103, 109, 120, 46, 100, 101]);

  const values = {
    name,
    addressInline: `${careOf}, ${street}, ${city}, ${country}`,
    mstv: `${name}, ${careOf}, ${street}, ${city} (§ 18 Abs. 2 MStV)`,
    footerOwner: `© 2026 ${name} · ChargeMerge für iOS, iPadOS & macOS`,
    footerPrivacy: `Stand: November 2026 · ${name}`,
    emailText: mail
  };

  for (const el of document.querySelectorAll("[data-contact]")) {
    const key = el.getAttribute("data-contact");
    if (key === "addressMultiline") {
      el.textContent = "";
      el.append(document.createTextNode(careOf), document.createElement("br"), document.createTextNode(street), document.createElement("br"), document.createTextNode(city), document.createElement("br"), document.createTextNode(country));
    } else if (key && Object.hasOwn(values, key)) {
      el.textContent = values[key];
    }
  }

  for (const link of document.querySelectorAll("[data-mailto]")) {
    const subject = link.getAttribute("data-subject") || "";
    const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
    link.setAttribute("href", `mailto:${mail}${query}`);
    if (link.hasAttribute("data-mailto-label")) {
      link.textContent = mail;
    }
  }
})();
