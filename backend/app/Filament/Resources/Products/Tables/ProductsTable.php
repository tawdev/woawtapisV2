<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nom')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('category.name')
                    ->label('Catégorie')
                    ->sortable()
                    ->badge()
                    ->color('primary'),
                TextColumn::make('price')
                    ->label('Prix')
                    ->suffix(' MAD')
                    ->sortable(),
                TextColumn::make('sale_price')
                    ->label('Prix soldé')
                    ->suffix(' MAD')
                    ->default('-')
                    ->sortable(),
                TextColumn::make('stock')
                    ->label('Stock')
                    ->numeric()
                    ->sortable()
                    ->color(fn(int $state): string => $state > 0 ? 'success' : 'danger'),
                IconColumn::make('featured')
                    ->label('Vedette')
                    ->boolean(),
                IconColumn::make('best_seller')
                    ->label('Best-seller')
                    ->boolean(),
                TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'active' => 'success',
                        'inactive' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('created_at')
                    ->label('Créé le')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Statut')
                    ->options(['active' => 'Actif', 'inactive' => 'Inactif']),
                SelectFilter::make('category_id')
                    ->label('Catégorie')
                    ->relationship('category', 'name'),
                SelectFilter::make('featured')
                    ->label('Vedette')
                    ->options([1 => 'Oui', 0 => 'Non']),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
