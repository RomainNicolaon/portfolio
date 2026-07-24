<nav class="sticky top-0 z-40 border-b border-term-border bg-term-panel/90 backdrop-blur supports-[backdrop-filter]:bg-term-panel/70">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 text-sm">
        <div class="flex items-center gap-3">
            <span class="flex items-center gap-1.5" aria-hidden="true">
                <span class="h-3 w-3 rounded-full bg-red-500/80"></span>
                <span class="h-3 w-3 rounded-full bg-yellow-500/80"></span>
                <span class="h-3 w-3 rounded-full bg-term-green"></span>
            </span>
            <a href="#hero" class="text-term-bright">
                <span class="text-term-dim">$</span> <?= e($profile['handle'] ?? 'user') ?>@<?= e($profile['host'] ?? 'portfolio') ?><span class="text-term-dim">:~</span>
            </a>
        </div>

        <ul class="hidden items-center gap-5 md:flex">
            <li><a href="#about" class="text-term-muted transition-colors hover:text-term-bright">./about</a></li>
            <li><a href="#experience" class="text-term-muted transition-colors hover:text-term-bright">./experience</a></li>
            <li><a href="#projects" class="text-term-muted transition-colors hover:text-term-bright">./projects</a></li>
            <li><a href="#skills" class="text-term-muted transition-colors hover:text-term-bright">./skills</a></li>
            <li><a href="#education" class="text-term-muted transition-colors hover:text-term-bright">./education</a></li>
            <li><a href="#contact" class="rounded border border-term-green px-3 py-1 text-term-bright transition-colors hover:bg-term-green hover:text-term-bg">./contact</a></li>
        </ul>

        <div class="hidden items-center gap-2 text-xs text-term-dim sm:flex md:hidden lg:flex">
            <span data-clock>--:--:--</span>
        </div>
    </div>
</nav>
