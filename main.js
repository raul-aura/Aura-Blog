
import { init as initSanatorium } from "./projects/sanatorium.js";

const projectScripts = {
    sanatorium: initSanatorium,
};

const data = [
    {
        name: "Sanatorium",
        desc: "Escape the sanatorium while completing tasks, avoiding a relentless entity, and surviving the fear of being chased.",
        file: "sanatorium"
    },
    {
        name: "Dawn of Piracy: Caribbean Tides",
        desc: "Embark on the ultimate pirate adventure: command your ship, battle in epic naval combat, and explore a vast RPG caribbean world.",
        file: "dop"
    },
    {
        name: "Whiskers' Wish",
        desc: "Explore a city park as an abandoned kitten, solving puzzles, battling enemies, and searching for a forever home.",
        file: "whiskers"
    },
    {
        name: "ESPIRITO Delusion",
        desc: "Explore the corrupted school, solve puzzles, and battle evil monsters in turn-based combat.",
        file: "espirito"
    }
];

const stackDiv = document.getElementById("portfolio");
const stack = document.getElementById("folderStack");

const nameEl = document.getElementById("infoProjectName");
const descEl = document.getElementById("infoProjectDesc");
const defaultName = nameEl.textContent;
const defaultDesc = descEl.textContent;

const countEl = document.getElementById("projectCount");
countEl.textContent = data.length;
 
const projectContainer = document.getElementById('projectContainer');
const closeButton = document.getElementById("closeProject");

const perspective = 350;
const size = 0.92;
const sizeOthers = size * 0.9;

let folders = [];

async function loadHTML(file) {
    const response = await fetch(`projects/${file}.html`);
    return await response.text();
}

async function loadPreview(file) {
    const response = await fetch(`projects/${file}.html`);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    return doc.querySelector(".project-preview");
}

async function createFolders() {
    for (const [i, proj] of data.entries()) {
        const folder = document.createElement("div");
        folder.className = "folder";

        const preview = document.createElement("div");
        preview.className = "preview";

        if (proj.file) {
            const projectPreview = await loadPreview(proj.file);

            if (projectPreview) {
                preview.appendChild(projectPreview);
            }
        }

        folder.appendChild(preview);

        folder.addEventListener("mouseenter", () => {
            nameEl.textContent = proj.name;
            descEl.textContent = proj.desc;

            const offset = 20;
            const offsetHalf = offset * 0.5;

            folders.forEach((f, j) => {
                if (j < i) {
                    f.style.transform = `perspective(${perspective}px) rotateX(-20deg) translateY(-${offset}px) scale(${sizeOthers})`;
                } else if (j > i) {
                    f.style.transform = `perspective(${perspective}px) rotateX(-20deg) translateY(${offsetHalf}px) scale(${sizeOthers})`;
                } else if (j === i) {
                    f.style.transform = `perspective(${perspective}px) rotateX(0deg) translateY(0) scale(${size})`;
                }
            });

            const rect = folder.getBoundingClientRect();
            const folderCenter = rect.top + rect.height / 2;
            const screenCenter = window.innerHeight / 2;
            const delta = folderCenter - screenCenter;

            window.scrollBy({
                top: delta * 0.8,
                behavior: "smooth"
            });
        });

        folder.addEventListener("mouseleave", () => {
            nameEl.textContent = defaultName;
            descEl.textContent = defaultDesc;

            folders.forEach((f) => {
                f.style.transform = `perspective(${perspective}px) rotateX(-20deg) scale(${size})`;
            });
        });

        folder.addEventListener('click', async () => {
            const rect = preview.getBoundingClientRect();
            const clone = preview.cloneNode(true);

            const layer = document.createElement("div");

            layer.style.position = "fixed";
            layer.style.left = "0";
            layer.style.top = "0";
            layer.style.width = "100vw";
            layer.style.height = "100vh";
            layer.style.margin = "0";
            layer.style.padding = "0";
            layer.style.zIndex = "9999";
            layer.style.pointerEvents = "none";
            layer.style.overflow = "hidden";

            clone.style.position = "absolute";
            clone.style.left = `${rect.left}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.width = `${rect.width}px`;
            clone.style.height = `${rect.height}px`;
            clone.style.margin = "0";
            clone.style.transform = "none";

            layer.appendChild(clone);
            document.body.appendChild(layer);

            preview.style.opacity = "0";

            const top = rect.top;
            const right = window.innerWidth - rect.right;
            const bottom = window.innerHeight - rect.bottom;
            const left = rect.left;

            layer.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;

            layer.offsetHeight;

            requestAnimationFrame(() => {
                layer.style.transition = "clip-path 0.6s ease";
                layer.style.clipPath = "inset(0)";
            });

            layer.addEventListener("transitionend", async () => {
                projectContainer.innerHTML = "";
                if (proj.file) {
                    projectContainer.innerHTML = await loadHTML(proj.file);
                }

                const init = projectScripts[proj.file];

                if (init) {
                    init(projectContainer);
                }

                projectContainer.style.opacity = "1";
                projectContainer.style.pointerEvents = "all";
                closeButton.style.opacity = "1";
                stackDiv.style.display = "none";

                layer.style.transition = "opacity 0.3s ease";
                layer.style.opacity = "0";
                await new Promise(resolve => setTimeout(resolve, 300));

                layer.remove();
                preview.style.opacity = "1";

            }, { once: true });
        });

        stack.appendChild(folder);
        folders.push(folder);
    };

    folders.forEach((f) => {
        f.style.transform = `perspective(${perspective}px) rotateX(-20deg) scale(${size})`;
    });
}

createFolders();

const folderCount = data.length;
const totalMovementNeeded = (folderCount - 1) * 140;
const maxScrollDistance = document.body.scrollHeight - window.innerHeight;
const multiplier = totalMovementNeeded / maxScrollDistance;

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const moveAmount = Math.min(scrollY * multiplier, totalMovementNeeded);
    stack.style.transform = `translate(-50%, calc(-20% - ${moveAmount}px))`;
});

closeButton.style.opacity = '0';

closeButton.addEventListener('click', () => {
    projectContainer.style.transition = 'opacity 0.3s ease';
    projectContainer.style.opacity = '0';
    projectContainer.style.pointerEvents = 'none';

    projectContainer.addEventListener('transitionend', () => {

        projectContainer.innerHTML = '';
        closeButton.style.opacity = '0';
        stackDiv.style.display = 'block';
        projectContainer.style.transition = 'none';

    }, { once: true });
});