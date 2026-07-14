
const data = [
    { name: "ESPIRITO Delusion", desc: "Explore the corrupted school, solve puzzles, and battle evil monsters in turn-based combat." },
    { name: "Sweet Dreams Core", desc: "Robust Unreal Engine 5 plugin that act as a framework to develop games quicker." }
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

let folders = [];

function createFolders() {
    data.forEach((proj, i) => {
        const folder = document.createElement("div");
        folder.className = "folder";

        const preview = document.createElement("div");
        preview.className = "preview";

        folder.appendChild(preview);

        folder.addEventListener("mouseenter", () => {
            nameEl.textContent = proj.name;
            descEl.textContent = proj.desc;

            const offset = 160;
            const offsetHalf = offset * 0.5;

            folders.forEach((f, j) => {
                if (j < i) {
                    f.style.transform = `perspective(500px) rotateX(-20deg) translateY(-${offset}px) scale(0.8)`;
                } else if (j > i) {
                    f.style.transform = `perspective(500px) rotateX(-20deg) translateY(${offsetHalf}px) scale(0.8)`;
                } else if (j === i) {
                    f.style.transform = "perspective(500px) rotateX(0deg)";
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
                f.style.transform = "perspective(500px) rotateX(-20deg) scale(1.0)";
            });
        });

        folder.addEventListener('click', async () => {
            const index = i;

            const clone = preview.cloneNode(true);

            const rect = preview.getBoundingClientRect();

            preview.style.opacity = '0';

            const computed = window.getComputedStyle(preview);

            clone.style.position = 'fixed';
            clone.style.left = rect.left + 'px';
            clone.style.top = rect.top + 'px';
            clone.style.width = rect.width + 'px';
            clone.style.height = rect.height + 'px';

            clone.style.transform = 'none';
            clone.style.transition = 'all 0.6s ease';

            clone.style.margin = '0';
            clone.style.zIndex = '2';
            clone.style.background = computed.background;

            document.body.appendChild(clone);

            requestAnimationFrame(() => {
                clone.style.left = '0';
                clone.style.top = '0';
                clone.style.width = '100vw';
                clone.style.height = '100vh';
                clone.style.transform = 'scale(1.0)';
            });

            clone.addEventListener('transitionend', async () => {

                const template = document.getElementById(`project${index + 1}-template`);

                projectContainer.innerHTML = '';
                projectContainer.appendChild(
                    template.content.cloneNode(true)
                );

                clone.remove();

                projectContainer.style.opacity = '1';
                preview.style.opacity = '1';
                closeButton.style.opacity = '1';
                stackDiv.style.display = 'none';

            }, { once: true });

        });

        stack.appendChild(folder);
        folders.push(folder);
    });
}

createFolders();

folders.forEach((f) => {
    f.style.transform = "perspective(500px) rotateX(-20deg)";
});

const folderCount = data.length;
const totalMovementNeeded = (folderCount - 1) * 200;
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

    projectContainer.addEventListener('transitionend', () => {

        projectContainer.innerHTML = '';
        closeButton.style.opacity = '0';
        stackDiv.style.display = 'block';
        projectContainer.style.transition = 'none';

    }, { once: true });
});