<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informations client')
                    ->schema([
                        TextInput::make('order_number')
                            ->label('Numéro de commande')
                            ->required()
                            ->columnSpan(2),
                        TextInput::make('customer_name')
                            ->label('Nom du client')
                            ->required(),
                        TextInput::make('customer_email')
                            ->label('Email')
                            ->email()
                            ->required(),
                        TextInput::make('customer_phone')
                            ->label('Téléphone')
                            ->tel()
                            ->required(),
                        TextInput::make('customer_city')
                            ->label('Ville')
                            ->required(),
                        TextInput::make('customer_postal_code')
                            ->label('Code postal')
                            ->default(null),
                        Textarea::make('customer_address')
                            ->label('Adresse complète')
                            ->required()
                            ->rows(2)
                            ->columnSpanFull(),
                    ])->columns(2),

                Section::make('Commande')
                    ->schema([
                        TextInput::make('total_amount')
                            ->label('Montant total (MAD)')
                            ->required()
                            ->numeric()
                            ->suffix('MAD'),
                        Select::make('status')
                            ->label('Statut')
                            ->options([
                                'pending' => '⏳ En attente',
                                'processing' => '⚙️ En traitement',
                                'shipped' => '🚚 Expédiée',
                                'delivered' => '✅ Livrée',
                                'cancelled' => '❌ Annulée',
                            ])
                            ->default('pending')
                            ->required(),
                        Textarea::make('notes')
                            ->label('Notes')
                            ->default(null)
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }
}
