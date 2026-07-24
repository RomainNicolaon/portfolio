<?php

/** @var array $faq */ $faq = $faq ?? []; ?>
<section id="faq" class="border-t border-term-border py-20">
    <div class="mx-auto max-w-5xl px-4">
        <header class="reveal mb-10">
            <p class="text-sm text-term-dim">
                <span class="text-term-green">$</span> cat faq.md
            </p>
            <h2 class="mt-2 text-2xl font-bold text-term-bright sm:text-3xl">// FAQ</h2>
        </header>

        <div class="space-y-3">
            <?php foreach ($faq as $item): ?>
                <details class="reveal group rounded-lg border border-term-border bg-term-panel px-5 py-4">
                    <summary class="flex cursor-pointer items-center gap-2 text-sm font-bold text-term-bright marker:content-['']">
                        <span class="text-term-green transition-transform group-open:rotate-90">&gt;</span>
                        <?= e($item['question'] ?? '') ?>
                    </summary>
                    <p class="mt-3 pl-5 leading-relaxed text-term-muted">
                        <?= e($item['answer'] ?? '') ?>
                    </p>
                </details>
            <?php endforeach; ?>
        </div>
    </div>
</section>