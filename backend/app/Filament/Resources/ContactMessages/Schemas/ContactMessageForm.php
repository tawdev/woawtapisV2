<?php

namespace App\Filament\Resources\ContactMessages\Schemas;

use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ContactMessageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informations du message')
                    ->schema([
                        TextInput::make('name')
                            ->label('Nom')
                            ->required(),
                        TextInput::make('email')
                            ->label('Email')
                            ->email()
                            ->required(),
                        TextInput::make('phone')
                            ->label('Téléphone')
                            ->tel()
                            ->default(null),
                        TextInput::make('subject')
                            ->label('Sujet')
                            ->required(),
                        Textarea::make('message')
                            ->label('Message')
                            ->required()
                            ->rows(5)
                            ->columnSpanFull(),
                        Select::make('status')
                            ->label('Statut')
                            ->options([
                                'new' => '🔵 Nouveau',
                                'read' => '👁️ Lu',
                                'replied' => '✅ Répondu',
                            ])
                            ->default('new')
                            ->required(),
                    ])->columns(2),
            ]);
    }
}
