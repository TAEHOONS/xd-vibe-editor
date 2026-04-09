<script setup lang="ts">
import { ref, nextTick, onMounted, watch, inject, computed } from 'vue';

const isDarkTheme = inject('isDarkTheme', ref(true));

const props = defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

type Segment = {
    type: 'text' | 'code';
    content: string;
    lang?: string;
    html?: string;
};

type Message = {
    role: 'user' | 'ai';
    segments: Segment[];
    status?: string | null;
};

const messages = ref<Message[]>([]);
const userInput = ref('');
const chatContainer = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const { init: initHighlighter, highlight, isReady: highlighterReady } = useHighlighter();

const hasContent = (msg: Message) => {
    return msg.segments.some(s => s.content.length > 0) || (msg.segments.length > 1);
};

onMounted(async () => {
    try {
        await initHighlighter();
        addMessage('ai', '안녕하세요! 무엇을 도와드릴까요? 코드에 대해 궁금한 점이 있으면 물어보세요.');
    } catch (e) {
        console.error('Failed to load Shiki highlighter:', e);
        addMessage('ai', '안녕하세요! (구문 강조 기능 로드 실패)');
    }
});

// Watch Theme Change to re-render code blocks
watch(() => isDarkTheme.value, async (newVal) => {
    if (!highlighterReady.value || messages.value.length === 0) return;

    const newTheme = newVal ? 'dark-plus' : 'light-plus';

    // Re-process all messages to update highlighting
    for (const msg of messages.value) {
        if (!msg.segments) continue;

        for (const seg of msg.segments) {
            if (seg.type === 'code' && seg.content) {
                const html = highlight(seg.content, seg.lang || 'text', newTheme);
                if (html) seg.html = html;
            }
        }
    }
});

const parseContent = (content: string): Segment[] => {
    const segments: Segment[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            segments.push({
                type: 'text',
                content: content.slice(lastIndex, match.index)
            });
        }

        const lang = match[1] || 'text';
        const code = match[2] || '';
        let html = '';

        const theme = isDarkTheme.value ? 'dark-plus' : 'light-plus';
        html = highlight(code, lang, theme) || `<pre><code>${code}</code></pre>`;

        segments.push({
            type: 'code',
            content: code,
            lang,
            html
        });

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
        segments.push({
            type: 'text',
            content: content.slice(lastIndex)
        });
    }

    return segments;
};

const addMessage = (role: 'user' | 'ai', text: string) => {
    const segments = parseContent(text);
    messages.value.push({ role, segments });
    scrollToBottom();
};

const sendMessage = async () => {
    if (!userInput.value.trim() || isLoading.value) return;

    const userText = userInput.value;
    addMessage('user', userText);
    userInput.value = '';
    
    isLoading.value = true;

    // Stream Logic Implementation
    // Stream Logic Implementation
    isLoading.value = true;
    let explanation = '';
    let codeBlock = '';
    
    // Create a temporary message placeholder with initialized status
    const aiMessageIndex = messages.value.length;
    messages.value.push({ role: 'ai', segments: [{ type: 'text', content: '' }], status: null });

    try {
        const response = await fetch(`/chatbot/engine/agent?query=${encodeURIComponent(userText)}`, { method: 'GET' });

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            if (value) {
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.slice(6).trim();
                        if (!jsonStr) continue;
                        
                        try {
                            const parsed = JSON.parse(jsonStr);
                            console.log('[DevAiChat] Stream Event:', parsed.type, parsed); // Debug log

                            // Handle Search Event
                            if (parsed.type === 'search') {
                                const msg = parsed.msg || "검색 중...";
                                // Directly modify the reactive object if possible, or create a clean copy
                                if (messages.value[aiMessageIndex]) {
                                    messages.value[aiMessageIndex] = {
                                        ...messages.value[aiMessageIndex],
                                        status: msg
                                    };
                                }
                            }

                            if (parsed.type === 'finish') {
                                done = true;
                                break;
                            }

                            if (parsed.type === 'result') {
                                const event = parsed.event; 
                                const data = parsed.data || "";

                                // Clear status if explanation or code starts arriving
                                if ((event === 'explanation' || event === 'vue_code') && data.trim()) {
                                    const currentMsg = messages.value[aiMessageIndex];
                                    if (currentMsg && currentMsg.status) {
                                         messages.value[aiMessageIndex] = {
                                            ...currentMsg,
                                            status: null
                                         };
                                    }
                                }

                                if (event === 'explanation') {
                                    explanation += data;
                                } else if (event === 'vue_code') {
                                    codeBlock += data;
                                } else if (event === 'separator') {
                                    explanation += data; 
                                }
                                
                                const segments = parseContent(explanation);
                                
                                if (codeBlock.trim()) {
                                    let cleanCode = codeBlock;
                                    let lang = 'vue'; // Default to vue since event is vue_code

                                    // Improved regex to handle occasional spaces or missing chars in stream
                                    // Matches ``` followed by optional lang, optional whitespace, then newline
                                    // Regex: ^``` + (optional lang) + (optional spaces) + newline
                                    const match = cleanCode.match(/^```\s*([a-zA-Z0-9_\-\+]+)?\s*\n/);
                                    
                                    if (match) {
                                        // If lang is explicit, use it. If explicit but empty (just ```\n), keep default 'vue'
                                        if (match[1]) {
                                            lang = match[1];
                                        }
                                        cleanCode = cleanCode.slice(match[0].length);
                                    } else if (cleanCode.startsWith('```')) {
                                         // Incomplete header, waiting for newline
                                         cleanCode = ''; 
                                    }

                                    // Remove closing ```
                                    if (cleanCode.endsWith('\n```')) {
                                        cleanCode = cleanCode.slice(0, -4);
                                    } else if (cleanCode.endsWith('```')) {
                                         cleanCode = cleanCode.slice(0, -3);
                                    }
                                    
                                    if (cleanCode) { 
                                        let html = '';
                                        const theme = isDarkTheme.value ? 'dark-plus' : 'light-plus';
                                        html = highlight(cleanCode, lang, theme) || `<pre><code>${cleanCode}</code></pre>`;
                                        
                                        segments.push({
                                            type: 'code',
                                            content: cleanCode,
                                            lang: lang,
                                            html: html
                                        });
                                    }
                                }

                                messages.value[aiMessageIndex] = {
                                    role: 'ai',
                                    segments: segments,
                                    status: messages.value[aiMessageIndex]?.status // preserve status if valid
                                };
                                scrollToBottom();
                            }
                        } catch (e) { /* ignore */ }
                    } else if (line.trim().startsWith('{')) {
                        // Fallback logic
                        try {
                             const parsed = JSON.parse(line.trim());
                             if (parsed.type === 'result' && parsed.data) {
                                  explanation += parsed.data;
                                  messages.value[aiMessageIndex] = {
                                    role: 'ai',
                                    segments: parseContent(explanation)
                                };
                                scrollToBottom();
                             }
                        } catch(e) {}
                    }
                }
            }
        }
    } catch (e) {
        console.error("Stream error:", e);
        messages.value[aiMessageIndex] = { role: 'ai', segments: [{ type: 'text', content: 'Connection Error or No Response.' }] };
    } finally {
        isLoading.value = false;
    }
};

const copyToClipboard = async (code: string) => {
    try {
        await navigator.clipboard.writeText(code);
    } catch (err) {
        console.error('Failed to copy keys: ', err);
    }
};

const scrollToBottom = () => {
    nextTick(() => {
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
    });
};

watch(() => props.isOpen, (newVal) => {
    if (newVal) scrollToBottom();
});

const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}
</script>

<template>
    <div class="chat-container d-flex flex-column h-100" :class="{ 'is-dark': isDarkTheme }">
        <!-- Header: 38px height to match Editor Tabs -->
        <div class="chat-header px-4 d-flex align-center justify-space-between" style="height: 38px; min-height: 38px;">
            <div class="d-flex align-center gap-2">
                <v-icon size="16" color="primary" class="mr-2">mdi-robot-excited-outline</v-icon>
                <span class="text-caption font-weight-bold text-uppercase" style="font-size: 13px !important; letter-spacing: 0.5px;">AI Assistant</span>
            </div>
            <v-btn icon variant="text" size="x-small" density="compact" @click="emit('close')">
                <v-icon size="16">mdi-close</v-icon>
            </v-btn>
        </div>

        <v-divider></v-divider>

        <div class="chat-messages flex-grow-1 overflow-y-auto pa-4" ref="chatContainer">
            <div 
                v-for="(msg, idx) in messages" 
                :key="idx" 
                class="message-wrapper d-flex mb-4"
                :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
            >
                <v-avatar v-if="msg.role === 'ai'" size="32" color="surface-light" class="mr-2 align-self-start">
                    <v-icon size="20" color="primary">mdi-robot</v-icon>
                </v-avatar>

                <div 
                    class="d-flex flex-column" 
                    :class="msg.role === 'user' ? 'align-end' : 'align-start'"
                    style="max-width: 85%;"
                >
                    <!-- Thinking Indicator -->
                     <div v-if="(msg.status || (msg.role === 'ai' && msg.segments && msg.segments.length > 0 && msg.segments[0] && !msg.segments[0].content && isLoading && idx === messages.length - 1))" 
                          class="thinking-status mb-2 px-4 py-3 rounded-lg d-flex align-center gap-1"
                          style="align-self: flex-start; width: fit-content; background-color: rgba(var(--v-theme-surface-variant), 0.1);">
                        <span class="dot" style="margin: 0 2px;"></span>
                        <span class="dot" style="margin: 0 2px;"></span>
                        <span class="dot" style="margin: 0 2px;"></span>
                    </div>

                    <div 
                        v-if="hasContent(msg) || msg.role === 'user'"
                        class="message-bubble pa-3 rounded-lg text-body-2"
                        :class="msg.role === 'user' ? 'bg-primary text-white user-bubble' : 'bg-surface-light text-high-emphasis ai-bubble'"
                    >
                        <template v-for="(seg, sIdx) in msg.segments" :key="sIdx">
                            <span v-if="seg.type === 'text'" style="white-space: pre-wrap;">{{ seg.content }}</span>
                            
                            <div v-else class="code-block mt-2 mb-2 rounded overflow-hidden">
                                <div class="code-header d-flex align-center justify-space-between px-3 py-1">
                                    <span class="text-caption text-medium-emphasis">{{ seg.lang }}</span>
                                    <v-btn 
                                        size="x-small" 
                                        variant="text" 
                                        prepend-icon="mdi-content-copy"
                                        @click="copyToClipboard(seg.content)"
                                    >
                                        Copy
                                    </v-btn>
                                </div>
                                <div class="code-content pa-3" v-html="seg.html"></div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <v-divider></v-divider>

        <div class="chat-input-area pa-4">
            <v-textarea
                v-model="userInput"
                variant="outlined"
                rows="1"
                auto-grow
                max-rows="5"
                density="compact"
                hide-details
                placeholder="코드에 대해 물어보세요..."
                class="chat-textarea"
                bg-color="surface"
                @keydown="handleKeydown"
            >
                <template #append-inner>
                    <v-btn 
                        icon 
                        variant="text" 
                        size="small" 
                        color="primary" 
                        class="mb-1"
                        :disabled="!userInput.trim() || isLoading"
                        @click="sendMessage"
                    >
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </template>
            </v-textarea>
        </div>
    </div>
</template>

<style scoped>
.chat-container {
    background-color: rgba(var(--v-theme-surface));
    color: rgba(var(--v-theme-on-surface));
}

.chat-header {
    background-color: rgba(var(--v-theme-surface-variant), 0.1);
    border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
    font-family: var(--font-ui);
}

.message-bubble {
    max-width: 90%;
    line-height: 1.5;
    word-break: keep-all; /* Prevents breaking inside words (important for Korean) */
    overflow-wrap: break-word; /* Allows breaking very long strings if needed */
    white-space: pre-wrap; /* Preserves newlines and spaces */
    width: fit-content; /* Ensures bubble sizes to content */
    display: inline-block; /* Helps with sizing behavior */
    text-align: left; /* Ensures text aligns left inside bubble even if bubble is right-aligned */
}

.user-bubble {
    border-top-right-radius: 0 !important;
}

.ai-bubble {
    border-top-left-radius: 0 !important;
    background-color: rgba(var(--v-theme-surface-variant), 0.15) !important;
    color: rgba(var(--v-theme-on-surface)) !important;
}

/* Light Mode Code Block Style (Card-like) */
.chat-container:not(.is-dark) .code-block {
    background-color: #ffffff !important;
    border: 1px solid #e0e0e0 !important;
    border-radius: 8px !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.chat-container:not(.is-dark) .code-header {
    background-color: #f6f8fa !important; /* GitHub Light Header */
    border-bottom: 1px solid #e0e0e0 !important;
    color: #57606a !important;
}
.chat-container:not(.is-dark) :deep(.shiki) {
    background-color: #ffffff !important;
    color: #24292f !important; /* Ensure text is dark if theme fails */
}

/* Dark Mode Code Block Style */
.chat-container.is-dark .code-block {
    background-color: #0F172A !important;
    border: 1px solid #334155 !important;
    border-radius: 8px !important;
}
.chat-container.is-dark .code-header {
    background-color: #1E293B !important;
    border-bottom: 1px solid #334155 !important;
    color: #CBD5E1 !important;
}
.chat-container.is-dark :deep(.shiki) {
    background-color: #0F172A !important;
    color: #CBD5E1 !important;
}

/* Common resets */
.code-block {
    overflow: hidden; /* Ensure rounded corners clip content */
    margin-top: 8px;
    margin-bottom: 8px;
}
.code-header {
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.code-content {
    overflow-x: auto;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.4;
    padding: 12px;
}
/* Ensure code background follows theme indirectly or is handled by Shiki HTML */
/* But Shiki handles its own background if we don't override it. 
   Usually Shiki sets 'pre' background. We might need to transparent it */
:deep(.shiki) {
    background-color: transparent !important;
}

.chat-textarea {
    font-size: 13px;
}

.thinking-status {
    background-color: #e0e0e0; /* Explicit Gray for Light/Dark common or adjust per theme if needed, user asked for gray */
    border: none;
    border-radius: 12px;
}

/* Dark theme override if needed, but 'gray' usually implies a visible gray */
.chat-container.is-dark .thinking-status {
     background-color: #3e3e3e; /* Darker gray for dark mode */
}

.dot {
    width: 6px;
    height: 6px;
    background-color: #666; /* Darker dot for contrast on gray */
    border-radius: 50%;
    animation: wave 1.3s linear infinite;
}

.chat-container.is-dark .dot {
    background-color: #aaa; /* Lighter dot for dark mode */
}

.dot:nth-child(1) { animation-delay: -1.1s; }
.dot:nth-child(2) { animation-delay: -0.9s; }
.dot:nth-child(3) { animation-delay: -0.7s; }

@keyframes wave {
	0%, 60%, 100% {
		transform: initial;
	}
	30% {
		transform: translateY(-5px);
	}
}

/* Remove unused skeletons */
.skeleton-line, .animate-pulse {
    display: none;
}
/* ... existing animations ... */

.chat-messages::-webkit-scrollbar {
    width: 6px;
}
.chat-messages::-webkit-scrollbar-track {
    background: transparent;
}
.chat-messages::-webkit-scrollbar-thumb {
    background-color: rgba(var(--v-theme-on-surface-variant), 0.4);
    border-radius: 3px;
}
</style>
